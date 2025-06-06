import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use localhost if backend is on same machine
  final String baseUrl = 'http://192.168.1.6:5000/api';

  Future<List<dynamic>> getAllDishes() async {
    final url = Uri.parse('$baseUrl/dishes');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load dishes');
    }
  }
}
