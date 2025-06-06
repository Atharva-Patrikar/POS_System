import 'package:flutter/material.dart';
import 'table_selection_screen.dart';

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
      home: const TableSelectionScreen(),
    );
  }
}
