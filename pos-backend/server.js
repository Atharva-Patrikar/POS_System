const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/category');
const dishRoutes = require('./routes/dish');
const orderRoutes = require('./routes/order');
const customerRoutes = require("./routes/customers"); // 💡 Move this up
const tableRoutes = require('./routes/tables');

const { sequelize } = require('./models');

const app = express(); // ✅ Now initialized before .use()

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes); // ✅ Now it works!
app.use('/api', categoryRoutes);
app.use('/api', dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => console.log('✅ Database synchronized!'))
  .catch((err) => console.error('❌ Database sync failed:', err));

app.get('/', (req, res) => {
  res.send('POS System API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
