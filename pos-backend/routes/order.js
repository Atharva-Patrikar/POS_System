const express = require("express");
const router = express.Router();
const { sequelize } = require("../models");

// POST - Save new order
router.post("/", async (req, res) => {
  const {
    order_type,
    table_info,
    people_count,
    customer,
    payment_type,
    subtotal,
    tax,
    discount,
    grand_total,
    items,
  } = req.body;

  const MAX_RETRIES = 5;
  let attempt = 0;
  let success = false;
  let orderId = null;
  let newOrderNumber = null;

  while (!success && attempt < MAX_RETRIES) {
    const t = await sequelize.transaction();
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const countResult = await sequelize.query(
        `SELECT COUNT(*) FROM orders WHERE created_at BETWEEN :start AND :end`,
        {
          replacements: { start: todayStart, end: todayEnd },
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      newOrderNumber = Number.parseInt(countResult[0].count) + 1;

      let customerId = null;
      let customerPhone = null;

      if (customer?.phone) {
        customerPhone = customer.phone;
        const existing = await sequelize.query(
          `SELECT id FROM customers WHERE phone = :phone`,
          {
            replacements: { phone: customer.phone },
            type: sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        if (existing.length > 0) {
          customerId = existing[0].id;
        } else if (customer.name || customer.phone) {
          const insert = await sequelize.query(
            `INSERT INTO customers (name, phone, address)
             VALUES (:name, :phone, :address) RETURNING id`,
            {
              replacements: {
                name: customer.name || "",
                phone: customer.phone || "",
                address: customer.address || "",
              },
              type: sequelize.QueryTypes.INSERT,
              transaction: t,
            }
          );
          customerId = insert[0][0].id;
        }
      }

      const orderInsert = await sequelize.query(
        `INSERT INTO orders (
          order_number, order_type, table_info, people_count, customer_id, customer_name,
          customer_phone, payment_type, subtotal, tax, discount, grand_total, status, created_at
        ) VALUES (
          :order_number, :order_type, :table_info, :people_count, :customer_id, :customer_name,
          :customer_phone, :payment_type, :subtotal, :tax, :discount, :grand_total, 'Saved', NOW()
        ) RETURNING id`,
        {
          replacements: {
            order_number: newOrderNumber.toString(),
            order_type,
            table_info: table_info || null,
            people_count: people_count || null,
            customer_id: customerId,
            customer_name: customer?.name || null,
            customer_phone: customerPhone,
            payment_type,
            subtotal,
            tax,
            discount,
            grand_total,
          },
          type: sequelize.QueryTypes.INSERT,
          transaction: t,
        }
      );

      orderId = orderInsert[0][0].id;

      for (const item of items) {
        await sequelize.query(
          `INSERT INTO order_items (order_id, dish_id, quantity, price)
           VALUES (:order_id, :dish_id, :quantity, :price)`,
          {
            replacements: {
              order_id: orderId,
              dish_id: item.id,
              quantity: item.qty,
              price: item.price,
            },
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          }
        );
      }

      await t.commit();
      success = true;
    } catch (err) {
      await t.rollback();
      if (
        err.name === "SequelizeDatabaseError" &&
        err.message.includes("unique_order_per_day")
      ) {
        attempt++;
        continue;
      }

      console.error("Order creation error:", err);
      return res.status(500).json({ success: false, message: "Failed to save order" });
    }
  }

  if (success) {
    return res.status(201).json({ success: true, order_id: orderId, order_number: newOrderNumber });
  } else {
    return res.status(500).json({ success: false, message: "Too many attempts, try again" });
  }
});

// GET - Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await sequelize.query(
      `SELECT 
        o.order_number,
        o.order_type,
        o.table_info,
        o.people_count,
        COALESCE(o.customer_name, c.name) AS customer_name,
        COALESCE(c.phone, '') AS customer_phone,
        o.payment_type,
        o.subtotal,
        o.tax,
        o.discount,
        o.grand_total,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(orders);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET - Fetch single order with items (Updated Route)
router.get('/order/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);

    // Validate if the order ID is a valid number
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    // Fetch order details
    const orderDetails = await sequelize.query(
      `SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.table_info,
        o.people_count,
        COALESCE(o.customer_name, c.name) AS customer_name,
        COALESCE(c.phone, '') AS customer_phone,
        o.payment_type,
        o.subtotal,
        o.tax,
        o.discount,
        o.grand_total,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = :orderId`,
      {
        replacements: { orderId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Fetch items for the order
    const items = await sequelize.query(
      `SELECT 
        oi.dish_id,
        d.name AS dish_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS total_price
      FROM order_items oi
      JOIN dishes d ON oi.dish_id = d.id
      WHERE oi.order_id = :orderId`,
      {
        replacements: { orderId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Return the order details along with items
    res.json({ order: orderDetails[0] || {}, items });
  } catch (err) {
    console.error('Order detail fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

module.exports = router;
