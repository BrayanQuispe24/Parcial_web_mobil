import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProductoComponentComponent } from "../producto-component/producto-component.component";
import { ProductoApiService } from '../../../../services/productoApi.service';

@Component({
  selector: 'producto-list-component',
  imports: [ProductoComponentComponent],
  templateUrl: './productoListComponent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoListComponentComponent {
  productoService=inject(ProductoApiService);

  listaProductos=this.productoService.productList;
}
