import { VentasServiceService } from './../../../../services/ventasService.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FacturaItemComponent } from "../factura-item/factura-item.component";

@Component({
  selector: 'lista-facturas',
  imports: [FacturaItemComponent],
  templateUrl: './lista-facturas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaFacturasComponent {

  facturaService=inject(VentasServiceService);

  listaProductos=this.facturaService.listaFacturas;
 }
