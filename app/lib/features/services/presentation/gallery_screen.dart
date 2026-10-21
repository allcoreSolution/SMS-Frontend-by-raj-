import 'package:flutter/material.dart';

class GalleryScreen extends StatelessWidget {
  const GalleryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("School Gallery")),
      body: const Center(
        child: Text("Event Gallery coming soon.", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
