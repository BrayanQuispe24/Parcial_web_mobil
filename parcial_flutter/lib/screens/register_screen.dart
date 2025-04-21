import 'package:flutter/material.dart';
import 'package:electro_store/services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isLoading = false;
  String _message = '';

  Future<void> _register() async {
    setState(() {
      _isLoading = true;
      _message = '';
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final firstName = _firstNameController.text.trim();

    // Llamada al servicio de registro y obtención del resultado
    final result = await AuthService.register(
      email: email,
      password: password,
      firstName: firstName,
    );

    setState(() {
      _isLoading = false;
      _message = result['message'] ?? 'Ocurrió un error';
    });

    if (result['success'] == true) {
      // Podés hacer un Navigator.pushReplacement a la pantalla principal si querés
      // Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => HomeScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registro')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _firstNameController,
              decoration: const InputDecoration(labelText: 'Nombre'),
            ),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Correo'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Contraseña'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _register,
                    child: const Text('Registrarse'),
                  ),
            const SizedBox(height: 20),
            Text(
              _message,
              style: TextStyle(
                color: _message.contains('exitoso') ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


