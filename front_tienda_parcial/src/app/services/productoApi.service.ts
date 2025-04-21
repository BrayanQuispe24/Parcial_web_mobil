import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Productos } from '../models/productos.interface';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductoApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  //propiedades para manejar los productos
  public productList = signal<Productos[]>([]);

  public productoActual = signal<Productos>({
    id: 0,
    descripcion: '',
    costo: 0.0,
    marca: '',
    categoria: '',
    cantidad: 0,
    precio: 0.0,
    estado: ''
  });

  public productoActualizar = signal<Productos>({
    id: 0,
    descripcion: '',
    costo: 0.0,
    marca: '',
    categoria: '',
    cantidad: 0,
    precio: 0.0,
    estado: ''
  });


  //Manejo de productos
  public getAllProductsForExport():Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.apiUrl}producto/producto_with_information`);
    }

  public getAllProducts() {
    this.http.get<Productos[]>(`${this.apiUrl}producto/producto_with_information`)
      .subscribe((resp) => {
        const listProduct: Productos[] = resp.map((producto) => {
          const productoDate: Productos = {
            id: producto.id,
            descripcion: producto.descripcion,
            costo: producto.costo,
            marca: producto.marca,
            categoria: producto.categoria,
            cantidad: producto.cantidad,
            precio: producto.precio,
            estado: producto.estado
          }
          return productoDate;
        })
        this.productList.set(listProduct);
        console.log(listProduct);
      })
  }

  public obtenerProductosPorCategoria(categoria: string) {
    this.http.get<Productos[]>(`${this.apiUrl}producto/productos_by_categoria?categoria=${categoria}`)
      .subscribe((resp) => {
        const listProduct: Productos[] = resp.map((producto) => {
          const productoDate: Productos = {
            id: producto.id,
            descripcion: producto.descripcion,
            costo: producto.costo,
            marca: producto.marca,
            categoria: producto.categoria,
            cantidad: producto.cantidad,
            precio: producto.precio,
            estado: producto.estado
          }
          return productoDate;
        })
        this.productList.set(listProduct);
      })
  }

  public obtenerProductosPorMarca(marca: string) {
    return this.http.get<Productos[]>(`${this.apiUrl}producto/productos_by_marca?marca=${marca}`)
      .subscribe((resp) => {
        const listProduct: Productos[] = resp.map((producto) => {
          const productoDate: Productos = {
            id: producto.id,
            descripcion: producto.descripcion,
            costo: producto.costo,
            marca: producto.marca,
            categoria: producto.categoria,
            cantidad: producto.cantidad,
            precio: producto.precio,
            estado: producto.estado
          }
          return productoDate;
        })
        this.productList.set(listProduct);
      })
  }

  public registrarProductoWithInventario(descripcion: string, estado: string, categoria: number, marca: number, costo: number, cantidad: number, precio: number): Observable<any> {
    const body = {
      descripcion: descripcion,
      estado: estado,
      categoria_id: categoria,
      marca_id: marca,
      costo: costo,
      cantidad: cantidad,
      precio: precio
    }
    console.log({ body });
    return this.http.post<any>(`${this.apiUrl}producto/crear_completo/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getAllProducts();
      })
    );
  }
  public actualizarProductoWithInventario(descripcion: string, nuevaDescripcion: string, categoria: string, marca: string, costo: number, cantidad: number, precio: number): Observable<any> {
    const body = {
      nombre_producto: descripcion,
      nueva_descripcion: nuevaDescripcion,
      nuevo_costo: costo,
      nueva_marca: marca,
      nueva_categoria: categoria,
      nueva_cantidad: cantidad,
      nuevo_precio: precio
    }
    console.log({ body });
    return this.http.post<any>(`${this.apiUrl}producto/actualizar_producto_completo/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getAllProducts();
      })
    );
  }

  public obtenerProductoByNombre(nombre: string): any {
    this.http.get<Productos>(`${this.apiUrl}producto/producto_by_nombre?nombre=${nombre}`).subscribe((resp) => {
      const producto: Productos = {
        id: resp.id,
        descripcion: resp.descripcion,
        costo: resp.costo,
        marca: resp.marca,
        categoria: resp.categoria,
        cantidad: resp.cantidad,
        precio: resp.precio,
        estado: resp.estado
      }
      this.productoActual.set(producto);
    })
  }

  public eliminarProductoByEstado(id: number, estado: string): any {

    const body = {
      producto_id: id,
      nuevo_estado: estado
    }

    // Realiza la solicitud para cambiar el estado del producto
    this.http.post<any>(`${this.apiUrl}producto/cambiar_estado/`, body).pipe(
      tap(() => {
        // Después de cambiar el estado, obtenemos todos los productos nuevamente
        this.getAllProducts();
      })
    ).subscribe(
      (response) => {
        console.log('Estado del producto actualizado correctamente', response);
      },
      (error) => {
        console.error('Error al actualizar el estado del producto', error);
      }
    );
  }

  public actualizarCantidad(producto_id: number, cantidad: number) {
    const body = {
      producto_id: producto_id,
      nueva_cantidad: cantidad
    };
    console.log(body);

    this.http.post<any>(`${this.apiUrl}producto/actualizar_cantidad/`, body).pipe(
      tap(() => {
        // Después de cambiar el estado, obtenemos todos los productos nuevamente
        this.getAllProducts();
      })
    ).subscribe({
      next: (response) => {
        console.log('Actualización exitosa:', response);
      },
      error: (error) => {
        console.error('Error actualizando cantidad:', error);
      }
    });
  }


  //manejo de peticiones

  constructor() { }

}
