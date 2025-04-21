import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Productos } from '../../../../models/productos.interface';
import { ProductoApiService } from '../../../../services/productoApi.service';
import { ModalService } from '../../../../services/modal.service';
import { ModalCantidadComponent } from "../modal-cantidad/modal-cantidad.component";
import { ImagenesServiceService } from '../../../../services/imagenesService.service';

@Component({
  selector: 'producto-inventario',
  imports: [ModalCantidadComponent],
  templateUrl: './producto-inventario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoInventarioComponent {
  producto = input<Productos>();

  productoService = inject(ProductoApiService);
  modalService = inject(ModalService);


  nuevaCantidad = signal<number>(0);
  cantidadActual = signal<number>(this.productoService.productoActualizar().cantidad);

  modalCantidad = signal<boolean>(true);

  imagenService = inject(ImagenesServiceService);

  listaDeImagenes = computed(() => (this.imagenService.listaImagenes()));
  imageUrl = computed(() => {
    const imagen = this.imagenService.listaImagenes().find(imagen =>
      imagen.producto_id === this.producto()?.id
    );
    return imagen?.url;
  });

  public mostrarModal() {
    this.subirProductoActual();
    this.mostrarModalCantidadSwitch();
  }

  public mostrarModalCantidadSwitch() {
    console.log('entra');
    this.modalCantidad.set(!this.modalCantidad());
  }

  private subirProductoActual() {
    const producto = this.producto();
    const productoReemplazo: Productos = {
      id: 0,
      descripcion: '',
      costo: 0.0,
      marca: '',
      categoria: '',
      cantidad: 0,
      precio: 0.0,
      estado: ''
    }
    this.productoService.productoActualizar.set(producto || productoReemplazo);
  }

  public habilitarProducto(): void {
    this.subirProductoActual();
    let nuevoEstado = 'habilitado';
    const id = this.productoService.productoActualizar().id;
    console.log(nuevoEstado);
    this.productoService.eliminarProductoByEstado(id, nuevoEstado);
    // this.productoService

  }
  public eliminarProducto(): void {
    this.subirProductoActual();
    let nuevoEstado = 'agotado';
    const id = this.productoService.productoActualizar().id;
    console.log(nuevoEstado);
    this.productoService.eliminarProductoByEstado(id, nuevoEstado);
    // this.productoService

  }

  public actualizarProducto(): void {
    const producto = this.producto();
    const productoReemplazo: Productos = {
      id: 0,
      descripcion: '',
      costo: 0.0,
      marca: '',
      categoria: '',
      cantidad: 0,
      precio: 0.0,
      estado: ''
    }
    this.productoService.productoActualizar.set(producto || productoReemplazo);
    this.modalService.mostrarActualizarProductoSwitch();

  }

}
