import 'package:flutter/material.dart';
import 'api_service.dart';
import 'dish_screen.dart';

class TableSelectionScreen extends StatefulWidget {
  const TableSelectionScreen({super.key});

  @override
  State<TableSelectionScreen> createState() => _TableSelectionScreenState();
}

class _TableSelectionScreenState extends State<TableSelectionScreen> {
  List<dynamic> tables = [];
  bool isLoading = true;
  Map<String, List<dynamic>> tablesByLocation = {};
  
  // New: Maintain carts per table
  final Map<int, List<Map<String, dynamic>>> tableCarts = {};

  @override
  void initState() {
    super.initState();
    fetchTables();
  }

  void fetchTables() async {
    try {
      final response = await ApiService().getTables();
      Map<String, List<dynamic>> grouped = {};
      for (var table in response) {
        String location = table['location'] ?? 'Unknown';
        if (!grouped.containsKey(location)) {
          grouped[location] = [];
        }
        grouped[location]!.add(table);
      }

      setState(() {
        tables = response;
        tablesByLocation = grouped;
        isLoading = false;
      });
    } catch (e) {
      print("Error fetching tables: $e");
      setState(() => isLoading = false);
    }
  }

  void _navigateToDishes(BuildContext context, Map<String, dynamic> table) async {
    int tableId = table['id'];
    List<Map<String, dynamic>> existingCart = tableCarts[tableId] ?? [];

    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => DishSearchScreen(
          selectedTable: table,
          existingCart: List<Map<String, dynamic>>.from(existingCart),
        ),
      ),
    );

    if (result != null && result is List<Map<String, dynamic>>) {
      setState(() {
        tableCarts[tableId] = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Table'),
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: ListView(
                children: tablesByLocation.entries.map((entry) {
                  final location = entry.key;
                  final locationTables = entry.value;

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Text(
                          location,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: locationTables.length,
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 4,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                          childAspectRatio: 1,
                        ),
                        itemBuilder: (context, index) {
                          final table = locationTables[index];
                          return GestureDetector(
                            onTap: () => _navigateToDishes(context, table),
                            child: Card(
                              color: Colors.amber.shade200,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 3,
                              child: Center(
                                child: Text(
                                  table['label'] ?? 'Table',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.black87,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 20),
                    ],
                  );
                }).toList(),
              ),
            ),
    );
  }
}
