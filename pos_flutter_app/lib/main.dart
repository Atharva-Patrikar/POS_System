import 'package:flutter/material.dart';
import 'api_service.dart';
import 'cart_screen.dart';

void main() {
  runApp(const MyExperimentApp());
}

class MyExperimentApp extends StatelessWidget {
  const MyExperimentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'POS App',
      home: const DishSearchScreen(),
    );
  }
}

class DishSearchScreen extends StatefulWidget {
  const DishSearchScreen({super.key});

  @override
  State<DishSearchScreen> createState() => _DishSearchScreenState();
}

class _DishSearchScreenState extends State<DishSearchScreen> {
  List<dynamic> allDishes = [];
  List<dynamic> filteredDishes = [];
  List<Map<String, dynamic>> cart = [];
  bool isLoading = true;
  String searchText = '';

  @override
  void initState() {
    super.initState();
    fetchDishes();
  }

  void fetchDishes() async {
    try {
      final dishes = await ApiService().getAllDishes();
      setState(() {
        allDishes = dishes;
        filteredDishes = dishes;
        isLoading = false;
      });
    } catch (e) {
      print("Error fetching dishes: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  void updateSearch(String value) {
    setState(() {
      searchText = value.trim();
      filteredDishes = allDishes
          .where((dish) =>
              dish['name']
                  ?.toString()
                  .toLowerCase()
                  .contains(searchText.toLowerCase()) ??
              false)
          .toList();
    });
  }

  void incrementQty(dynamic dish) {
    final index = cart.indexWhere((item) => item['id'] == dish['id']);
    if (index != -1) {
      setState(() {
        cart[index]['quantity'] += 1;
      });
    } else {
      setState(() {
        cart.add({
          'id': dish['id'],
          'name': dish['name'],
          'price': double.parse(dish['price'].toString()),
          'quantity': 1,
        });
      });
    }
  }

  void decrementQty(dynamic dish) {
    final index = cart.indexWhere((item) => item['id'] == dish['id']);
    if (index != -1) {
      if (cart[index]['quantity'] > 1) {
        setState(() {
          cart[index]['quantity'] -= 1;
        });
      } else {
        setState(() {
          cart.removeAt(index);
        });
      }
    }
  }

  int getDishQty(int dishId) {
    final item = cart.firstWhere(
      (element) => element['id'] == dishId,
      orElse: () => {},
    );
    return item.isNotEmpty ? item['quantity'] : 0;
  }

  void goToCart() async {
    final updatedCart = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CartScreen(cart: List<Map<String, dynamic>>.from(cart)),
      ),
    );

    if (updatedCart != null && updatedCart is List<Map<String, dynamic>>) {
      setState(() {
        cart = updatedCart;
      });
    }
  }

  Color? getTypeColor(String? type) {
    switch (type) {
      case 'Veg':
        return Colors.green;
      case 'Non-Veg':
        return Colors.red;
      case 'Egg':
        return Colors.yellow[700];
      default:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('POS App'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: goToCart,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              decoration: const InputDecoration(
                labelText: 'Search Dishes',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: updateSearch,
              textInputAction: TextInputAction.search,
            ),
          ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredDishes.isEmpty
                    ? const Center(
                        child: Text(
                          'No matching dishes found.',
                          style: TextStyle(fontSize: 16),
                        ),
                      )
                    : ListView.builder(
                        itemCount: filteredDishes.length,
                        itemBuilder: (context, index) {
                          final dish = filteredDishes[index];
                          final typeColor =
                              getTypeColor(dish['type']?.toString());
                          final qty = getDishQty(dish['id']);

                          return ListTile(
                            leading: typeColor != null
                                ? Container(
                                    width: 12,
                                    height: 12,
                                    decoration: BoxDecoration(
                                      color: typeColor,
                                      shape: BoxShape.circle,
                                    ),
                                  )
                                : null,
                            title: Text(dish['name']),
                            subtitle: Text('₹${dish['price']}'),
                            trailing: qty == 0
                                ? ElevatedButton(
                                    onPressed: () => incrementQty(dish),
                                    child: const Text('Add to Cart'),
                                  )
                                : Container(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(8),
                                      color: Colors.green.shade50,
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 4, vertical: 2),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.remove),
                                          onPressed: () =>
                                              decrementQty(dish),
                                        ),
                                        Text(
                                          '$qty',
                                          style: const TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.add),
                                          onPressed: () =>
                                              incrementQty(dish),
                                        ),
                                      ],
                                    ),
                                  ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
