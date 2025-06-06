import 'package:flutter/material.dart';
import 'api_service.dart';

class CartScreen extends StatefulWidget {
  final List<Map<String, dynamic>> cart;
  final Map<String, dynamic> selectedTable; // Added selectedTable

  const CartScreen({
    super.key,
    required this.cart,
    required this.selectedTable, // Added selectedTable
  });

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late List<Map<String, dynamic>> cart;
  String selectedPaymentMethod = "Cash"; // default
  bool isSaving = false;

  final ApiService apiService = ApiService();

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

  Future<void> onSaveOrder() async {
    if (cart.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cart is empty')),
      );
      return;
    }

    setState(() {
      isSaving = true;
    });

    final subtotal = getTotal();
    final tax = 0.0; // adjust if needed
    final discount = 0.0; // adjust if needed
    final grandTotal = subtotal + tax - discount;

    // Extract tableNumber from selectedTable safely
    final tableNumber = widget.selectedTable['table_number'] ??
        widget.selectedTable['number'] ??
        widget.selectedTable['label'] ??
        'Unknown';

    final success = await apiService.saveOrder(
      paymentType: selectedPaymentMethod,
      subtotal: subtotal,
      tax: tax,
      discount: discount,
      grandTotal: grandTotal,
      items: cart,
      tableNumber: tableNumber, // Pass table number here
    );

    setState(() {
      isSaving = false;
    });

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Order saved successfully')),
      );
      Navigator.pop(context, []); // Clear cart on success
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to save order')),
      );
    }
  }

  void onPrint() {
    // TODO: implement print logic
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Print not implemented yet')),
    );
  }

  void onKOT() {
    // TODO: implement KOT logic
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('KOT not implemented yet')),
    );
  }

  Widget buildPaymentButton(String method) {
    final bool isSelected = selectedPaymentMethod == method;
    return Expanded(
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: isSelected ? Colors.green : null,
        ),
        onPressed: () {
          setState(() {
            selectedPaymentMethod = method;
          });
        },
        child: Text(method),
      ),
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
        body: Column(
          children: [
            Expanded(
              child: cart.isEmpty
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
            const Divider(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  buildPaymentButton("Cash"),
                  const SizedBox(width: 8),
                  buildPaymentButton("Card"),
                  const SizedBox(width: 8),
                  buildPaymentButton("UPI"),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: isSaving ? null : onSaveOrder,
                      child: isSaving
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text("Save"),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onPrint,
                      child: const Text("Print"),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onKOT,
                      child: const Text("KOT"),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
