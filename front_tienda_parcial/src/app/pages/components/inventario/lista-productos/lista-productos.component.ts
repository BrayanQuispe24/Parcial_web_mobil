import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductoComponentComponent } from "../../products/producto-component/producto-component.component";
import { ProductoApiService } from '../../../../services/productoApi.service';
import { ProductoInventarioComponent } from "../producto-inventario/producto-inventario.component";

@Component({
  selector: 'lista-productos-inventario',
  imports: [ ProductoInventarioComponent],
  templateUrl: './lista-productos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductosComponent {
  productoService=inject(ProductoApiService);

  listaProductos=this.productoService.productList;
}

