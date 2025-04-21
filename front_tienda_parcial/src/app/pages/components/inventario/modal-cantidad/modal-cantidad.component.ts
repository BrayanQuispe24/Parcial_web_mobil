import { ModalService } from './../../../../services/modal.service';
import { ProductoApiService } from './../../../../services/productoApi.service';
import { ChangeDetectionStrategy, Component, inject, Output, signal, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'modal-cantidad',
  imports: [],
  templateUrl: './modal-cantidad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCantidadComponent {
  prodcutoService = inject(ProductoApiService);
  productoActual = this.prodcutoService.productoActualizar;
  modalService = inject(ModalService);

  nuevaCantidad = signal<string>('');

  @Output() cerrar = new EventEmitter<void>();
  producto=input();

  cantidadActual = this.productoActual().cantidad;

  public cerrarModal() {
    this.cerrar.emit();
  }

  public cambiarCantidad() {
    console.log(this.productoActual())
    const id=this.productoActual().id;
    const nuevaCantidad = +this.nuevaCantidad();
    this.prodcutoService.actualizarCantidad(id, nuevaCantidad);
    this.cerrar.emit();
  }

}
