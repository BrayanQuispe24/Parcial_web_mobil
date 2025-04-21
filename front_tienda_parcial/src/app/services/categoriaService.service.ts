import { environment } from './../../environments/environment.development';
import { inject, Injectable, signal } from '@angular/core';
import { Categorias } from '../models/categorias.interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  //endpoint del back
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  //aqui estaran todas las categorias que tendremos en la base de datos
  categorias = signal<Categorias[]>([]);
  //categoria actualizar
  categoriaActualizar = signal<Categorias>({
    id: 0,
    nombre: ''
  });
  //categoria actual
  categoriaActual = signal<Categorias>({
    id: 0,
    nombre: ''
  });

  constructor() { }

  public getCategorias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(`${this.apiUrl}categoria/obtener_categorias`);
  }

  public registrarCategoria(nombre: string): Observable<any> {
    const body = { nombre };
    return this.http.post<any>(`${this.apiUrl}categoria/registrar/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getCategorias().subscribe((categorias) => {
          this.categorias.set(categorias);
        });
      })
    );
  }

  public editarCategoria(id: number, nombre: string): Observable<any> {
    const body = {
      id: id,
      nombre: nombre
    }
    return this.http.put<any>(`${this.apiUrl}categoria/actualizar/`, body).pipe(
      tap(() => {
        // después de registrar, actualizamos el signal
        this.getCategorias().subscribe((categorias) => {
          this.categorias.set(categorias);
        });
      })
    );
  }

  public buscarCategoria(id: number): Observable<Categorias> {
    return this.http.get<Categorias>(`${this.apiUrl}categoria/${id}`);
  }


}
