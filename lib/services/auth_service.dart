import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = 'http://ec2-3-145-107-109.us-east-2.compute.amazonaws.com:8000/auth/';
    
  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
  }) async {
    final url = Uri.parse('${baseUrl}register/');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
          'first_name': firstName,
          'role': 'CLIENT',
        }),
      );

      if (response.statusCode == 201) {
        return {'success': true, 'message': 'Registro exitoso 🎉'};
      } else {
        final body = jsonDecode(response.body);
        String errorMessage = 'Error desconocido';
        if (body is Map<String, dynamic>) {
          errorMessage = body.values.first.toString();
        }
        return {'success': false, 'message': errorMessage};
      }
    } catch (e) {
      return {'success': false, 'message': 'Error de red: $e'};
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse('${baseUrl}login/');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return {
          'success': true,
          'message': 'Login exitoso',
          'token': body['token'],
        };
      } else {
        final body = jsonDecode(response.body);
        return {
          'success': false,
          'message': body['message'] ?? 'Credenciales inválidas',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Error de red: $e',
      };
    }
  }
}

