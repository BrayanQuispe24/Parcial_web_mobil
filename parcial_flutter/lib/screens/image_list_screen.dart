import 'package:flutter/material.dart';
import '../services/image_service.dart';
import '../models/image_model.dart';

class ImageListScreen extends StatefulWidget {
  const ImageListScreen({super.key});

  @override
  State<ImageListScreen> createState() => _ImageListScreenState();
}

class _ImageListScreenState extends State<ImageListScreen> {
  late Future<List<ImageModel>> _futureImages;

  @override
  void initState() {
    super.initState();
    _futureImages = ImageService.fetchAllImages();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<ImageModel>>(
      future: _futureImages,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No hay imágenes disponibles'));
        } else {
          final images = snapshot.data!;
          return GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.75,
            ),
            itemCount: images.length,
            itemBuilder: (context, index) {
              final image = images[index];
              return Container(
                decoration: BoxDecoration(
                  color: Colors.deepPurple[50],
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.shade300,
                      blurRadius: 5,
                      offset: const Offset(2, 2),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                        child: Image.network(
                          image.url,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (_, __, ___) => const Icon(Icons.broken_image, size: 50),
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 6.0),
                      child: Text(
                        'Nombre', // Placeholder
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    const Text('\$Precio'), // Placeholder
                    ElevatedButton(
                      onPressed: () {},
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all(Colors.deepPurple),
                      ),
                      child: const Text("Agregar al carrito"),
                    ),
                  ],
                ),
              );
            },
          );
        }
      },
    );
  }
}
