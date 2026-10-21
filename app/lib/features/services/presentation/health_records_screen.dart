import 'package:flutter/material.dart';

class HealthRecordsScreen extends StatelessWidget {
  const HealthRecordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Health Records")),
      body: const Center(
        child: Text("Student Health Records coming soon.", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
