import { inject, Injectable, signal } from '@angular/core';
import { Clientes } from '../models/clientes.interface';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  //lista de clientes
  listaClientes = signal<Clientes[]>([]);
  //cliente actual
  clienteActual = signal<Clientes>({
    id: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    estado: '',
    usuario_id: 0
  });
  clienteActualizar = signal<Clientes>({
    id: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    estado: '',
    usuario_id: 0
  });


  public obtenerTodosLosClientes() {
    this.http.get<Clientes[]>(`${this.apiUrl}cliente/obtener_clientes`).subscribe((resp) => {
      const listaClientes: Clientes[] = resp.map((personal) => {
        const personalDate: Clientes = {
          id: personal.id,
          nombre: personal.nombre,
          apellido: personal.apellido,
          telefono: personal.telefono,
          direccion: personal.direccion,
          estado: personal.estado,
          usuario_id: personal.usuario_id,
        }
        return personalDate;
      })
      this.listaClientes.set(listaClientes);
      console.log(listaClientes);
    })
  }
  public registrarCliente(nombre: string, apellido: string, telefono: string, direccion: string, estado: string, usuario_id: number): Observable<any> {
    const body = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion: direccion,
      estado: estado,
      usuario_id: usuario_id,
    }
    console.log({ body });
    return this.http.post<any>(`${this.apiUrl}cliente/registrar/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.obtenerTodosLosClientes();
      })
    );
  }
 //todo: falta implementar el actualizar


  constructor() { }

}
