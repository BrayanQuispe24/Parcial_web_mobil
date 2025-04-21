import { inject, Injectable, signal } from '@angular/core';
import { Personal } from '../models/personal.interface';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonalServiceService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);


  //lista de personal
  public listaPersonal = signal<Personal[]>([]);
  //personal actual
  public personalActual = signal<Personal>({
    id: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    rol: '',
    usuario_id: 0,
    estado: ''
  });
  //personal a actualizar
  public personalActualizar = signal<Personal>({
    id: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    rol: '',
    usuario_id: 0,
    estado: ''
  });

  //obtener todos el personal
  public obtenerTodoPersonal() {
    this.http.get<Personal[]>(`${this.apiUrl}personal/obtener_personal_all`).subscribe((resp) => {
      const listPersonal: Personal[] = resp.map((personal) => {
        const personalDate: Personal = {
          id: personal.id,
          nombre: personal.nombre,
          apellido: personal.apellido,
          telefono: personal.telefono,
          direccion: personal.direccion,
          fecha_nacimiento: personal.fecha_nacimiento,
          rol: personal.rol,
          usuario_id: personal.usuario_id,
          estado: 'activo'
        }
        return personalDate;
      })
      this.listaPersonal.set(listPersonal);
      console.log(listPersonal);
    })
  }

  public registrarPersonal(nombre: string, apellido: string, telefono: string, direccion: string, fecha_nacimiento: string, rol: string, correo_electronico: string): Observable<any> {
    const body = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion: direccion,
      fecha_nacimiento: fecha_nacimiento,
      rol: rol,
      correo_electronico: correo_electronico
    }
    console.log({ body });
    return this.http.post<any>(`${this.apiUrl}personal/crear/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.obtenerTodoPersonal();
      })
    );
  }

  constructor() { }

}
