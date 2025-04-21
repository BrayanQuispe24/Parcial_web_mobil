import { inject, Injectable, signal } from '@angular/core';
import { Imagenes } from '../models/imagenes.interface';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesServiceService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  //lista de imagenes
  public listaImagenes = signal<Imagenes[]>([]);
  //imagen actual
  public imagenActual = signal<Imagenes>({
    id: 0,
    url: '',
    producto_id: 0
  });

  public obtenerTodasLasImagenes() {
    this.http.get<Imagenes[]>(`${this.apiUrl}imagenes/obtener_imagenes`).subscribe((resp) => {
      const listaDeImagenes: Imagenes[] = resp.map((imagen) => {
        const imagenDate: Imagenes = {
          id: imagen.id,
          url: imagen.url,
          producto_id: imagen.producto_id
        }
        return imagenDate;
      })
      this.listaImagenes.set(listaDeImagenes);
      console.log(listaDeImagenes);
    })
  }
  public registrarImagen(url: string, producto_id: number) {
    const body = {
      producto_id: producto_id,
      url: url
    }
    console.log({ body });
    this.http.post<any>(`${this.apiUrl}imagenes/crear/`, body).subscribe((resp) => {
      this.obtenerTodasLasImagenes();
    }
    );
  }

  constructor() { }

}
