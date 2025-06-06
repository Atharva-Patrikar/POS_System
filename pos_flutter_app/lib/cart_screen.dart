import 'package:flutter/material.dart';

class CartScreen extends StatefulWidget {
  final List<Map<String, dynamic>> cart;

  const CartScreen({super.key, required this.cart});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late List<Map<String, dynamic>> cart;

  @override
  void initState() {
    super.initState();
    cart = List<Map<String, dynamic>>.from(widget.cart);
  }

  void increaseQuantity(int index) {
    setState(() {
      cart[index]['quantity'] += 1;
    });
  }

  void decreaseQuantity(int index) {
    setState(() {
      if (cart[index]['quantity'] > 1) {
        cart[index]['quantity'] -= 1;
      } else {
        cart.removeAt(index);
      }
    });
  }

  void deleteItem(int index) {
    setState(() {
      cart.removeAt(index);
    });
  }

  double getTotal() {
    return cart.fold(
      0.0,
      (sum, item) =>
          sum + (item['price'] as num) * (item['quantity'] as int),
    );
  }

  @override
  Widget build(BuildContext context) {
    double total = getTotal();

    return WillPopScope(
      onWillPop: () async {
        Navigator.pop(context, cart); // Pass updated cart back
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Cart'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context, cart),
          ),
        ),
        body: cart.isEmpty
            ? const Center(child: Text('Cart is empty'))
            : ListView.builder(
                itemCount: cart.length + 1,
                itemBuilder: (context, index) {
                  if (index == cart.length) {
                    return ListTile(
                      title: const Text(
                        'Grand Total',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      trailing: Text(
                        '₹${total.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 18,
                          color: Colors.green,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  }

                  final item = cart[index];
                  double price = item['price'] is String
                      ? double.parse(item['price'])
                      : item['price'];
                  int quantity = item['quantity'];

                  return ListTile(
                    title: Text(item['name']),
                    subtitle: Text(
                      '₹${price.toStringAsFixed(2)} x $quantity = ₹${(price * quantity).toStringAsFixed(2)}',
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          onPressed: () => decreaseQuantity(index),
                        ),
                        Text(
                          '$quantity',
                          style: const TextStyle(fontSize: 16),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          onPressed: () => increaseQuantity(index),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => deleteItem(index),
                        ),
                      ],
                    ),
                  );
                },
              ),
      ),
    );
  }
}
