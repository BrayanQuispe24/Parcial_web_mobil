import { inject, Injectable, signal } from '@angular/core';
import { Facturas } from '../models/factura.interface';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VentasServiceService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;


  public listaFacturas = signal<Facturas[]>([]);

  //factura actual
  public facturaActual = signal<Facturas>({
    id: 0,
    fecha: '',
    total: 0.0,
    estado: '',
    metodo_id: 0,
    cliente_id: 0
  });

  public obtenerTodasLasFacturas() {
    this.http.get<Facturas[]>(`${this.apiUrl}factura/obtener_facturas`).subscribe((resp) => {
      const listaFactura: Facturas[] = resp.map((factura) => {
        const personalDate: Facturas = {
          id: factura.id,
          fecha: factura.fecha,
          total: factura.total,
          estado: factura.estado,
          metodo_id: factura.metodo_id,
          cliente_id: factura.cliente_id
        }
        return personalDate;
      })
      this.listaFacturas.set(listaFactura);
      console.log(listaFactura);
    })
  }

  constructor() { }

}
