import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl = 'http://192.168.1.6:5000/api'; // your backend

  Future<List<dynamic>> getAllDishes() async {
    final response = await http.get(Uri.parse('$baseUrl/dishes'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load dishes');
    }
  }

  Future<List<dynamic>> getTables() async {
    final response = await http.get(Uri.parse('$baseUrl/tables'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load tables');
    }
  }

  Future<bool> saveOrder({
    required String paymentType,
    required double subtotal,
    required double tax,
    required double discount,
    required double grandTotal,
    required List<Map<String, dynamic>> items,
    String? tableNumber, // added optional tableNumber parameter
  }) async {
    final orderData = {
      "order_type": "Dine In",  // fixed value
      "table_info": tableNumber, // send table number here
      "people_count": null,     // set if you track this in UI
      "customer": {},           // customer info if available
      "payment_type": paymentType,
      "subtotal": subtotal,
      "tax": tax,
      "discount": discount,
      "grand_total": grandTotal,
      "items": items.map((item) => {
        "id": item['id'],
        "qty": item['quantity'],
        "price": item['price'],
      }).toList(),
    };

    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(orderData),
    );

    if (response.statusCode == 201) {
      return true;
    } else {
      print('Failed to save order: ${response.body}');
      return false;
    }
  }
}
