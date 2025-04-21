import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:electro_store/screens/login_screen.dart';
import 'package:electro_store/screens/image_list_screen.dart';
// Ajusta la ruta según corresponda

// Importa para manejar el cierre de sesión

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  // Función para cerrar sesión
  Future<void> _logout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(
      'token',
    ); // Elimina el token o cualquier dato que identifique al usuario

    // Redirige a la pantalla de login
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => const LoginScreen(),
      ), // Asegúrate de importar la pantalla de login
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: const [
            DrawerHeader(
              decoration: BoxDecoration(color: Colors.deepPurple),
              child: Text(
                'Categorías',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            ListTile(title: Text('Categoría 1'), leading: Icon(Icons.category)),
            ListTile(title: Text('Categoría 2'), leading: Icon(Icons.category)),
            ListTile(title: Text('Categoría 3'), leading: Icon(Icons.category)),
          ],
        ),
      ),

      appBar: AppBar(
        title: const Text("Electro Store"),
        backgroundColor: Colors.deepPurple,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.account_circle),
            onSelected: (value) {
              if (value == 'edit') {
                // Aquí navegarías a la pantalla de editar perfil
              } else if (value == 'logout') {
                _logout(context);
              }
            },
            itemBuilder:
                (context) => const [
                  PopupMenuItem(value: 'edit', child: Text('Editar perfil')),
                  PopupMenuItem(value: 'logout', child: Text('Cerrar sesión')),
                ],
          ),
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              // Lógica para mostrar el carrito
            },
          ),
        ],
      ),

      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Buscar productos...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      fillColor: Colors.grey[200],
                      filled: true,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                IconButton(
                  icon: const Icon(Icons.mic, color: Colors.deepPurple),
                  onPressed: () {
                    // Implementar búsqueda por voz
                  },
                ),
              ],
            ),
          ),

          /// 🔄 Aquí se muestra la lista dinámica de imágenes desde el backend
          const Expanded(child: ImageListScreen()),
        ],
      ),
    );
  }
}
