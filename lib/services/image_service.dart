import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/image_model.dart';

class ImageService {
  static const String baseUrl = 'http://ec2-3-145-107-109.us-east-2.compute.amazonaws.com:8000/imagenes/';

  static Future<List<ImageModel>> fetchAllImages() async {
    final response = await http.get(Uri.parse('${baseUrl}obtener_imagenes'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => ImageModel.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar las imágenes');
    }
  }
}
