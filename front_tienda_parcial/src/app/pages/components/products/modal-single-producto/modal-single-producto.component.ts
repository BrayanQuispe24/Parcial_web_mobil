import { ModalService } from './../../../../services/modal.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductoApiService } from '../../../../services/productoApi.service';

@Component({
  selector: 'modal-single-producto',
  imports: [],
  templateUrl: './modal-single-producto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSingleProductoComponent {
 productoService=inject(ProductoApiService);
 modalService=inject(ModalService);

productoActual=this.productoService.productoActual;


}
