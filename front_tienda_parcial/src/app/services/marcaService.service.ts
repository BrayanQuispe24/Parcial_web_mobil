import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Marca } from '../models/marcas.interface';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MarcaServiceService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  //propiedades auxiliares para guardar informacion
  listaMarcas = signal<Marca[]>([]);
  marcaActual = signal<Marca>({
    id: 0,
    nombre: '',
    estado: true
  });
  marcaActualizar = signal<Marca>({
    id: 0,
    nombre: '',
    estado: true
  });

  public getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}marca/obtener_marcas`);
  }

  public registrarMarca(nombre: string, estado: boolean): Observable<any> {
    const body = {
      nombre: nombre,
      estado: estado
    };
    return this.http.post<any>(`${this.apiUrl}marca/crear/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getMarcas().subscribe((marcas) => {
          this.listaMarcas.set(marcas);
        });
      })
    );
  }

  public editarMarca(id: number, nombre: string, estado: boolean): Observable<any> {
    const body = {
      id: id,
      nombre: nombre,
      estado: estado
    }
    return this.http.put<any>(`${this.apiUrl}marca/actualizar/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getMarcas().subscribe((marcas) => {
          this.listaMarcas.set(marcas);
        });
      })
    );
  }
  constructor() { }

}
