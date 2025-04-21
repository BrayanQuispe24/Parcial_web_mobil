import { ProductoApiService } from './../../../../services/productoApi.service';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Productos } from '../../../../models/productos.interface';
import { ModalService } from '../../../../services/modal.service';
import { ImagenesServiceService } from '../../../../services/imagenesService.service';
import { Imagenes } from '../../../../models/imagenes.interface';

@Component({
  selector: 'producto-component',
  imports: [],
  templateUrl: './producto-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoComponentComponent {
  producto = input<Productos>();

  productoService = inject(ProductoApiService);
  modalService = inject(ModalService);
  imagenService = inject(ImagenesServiceService);

  listaDeImagenes = computed(() => (this.imagenService.listaImagenes()));
  imageUrl = computed(() => {
    const imagen = this.imagenService.listaImagenes().find(imagen =>
      imagen.producto_id === this.producto()?.id
    );
    return imagen?.url;
  });

  // public buscarUrl() {
  //   const imagene = this.listaDeImagenes().find((imagen) => (imagen.producto_id == this.producto()?.id));
  //   console.log(imagene);
  //   this.imageUrl.set(imagene?.url);
  // }

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

  public eliminarProducto(): void {
    this.subirProductoActual();
    const id = this.productoService.productoActualizar().id;
    const nuevoEstado = 'agotado';
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

  onFileSelected(event: any, productoId: number) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);  // Archivo seleccionado
    formData.append('upload_preset', 'electrodomesticos');  // El nombre del preset
    formData.append('public_id', `producto_${productoId}`);  // Nombre personalizado del archivo

    // Subir a Cloudinary
    fetch('https://api.cloudinary.com/v1_1/diqqfka6g/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('Imagen subida:', data);
        // this.imageUrl.(data.secure_url);
        this.imagenService.registrarImagen(data.secure_url, productoId);  // URL de la imagen subida
      })
      .catch(err => console.error('Error:', err));
  }

  ngOnInit(): void {
    // this.buscarUrl();
  }


}
