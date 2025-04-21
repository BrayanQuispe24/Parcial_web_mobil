import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProductoApiService } from '../../../../services/productoApi.service';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { ToastrService } from 'ngx-toastr';
import { Marca } from '../../../../models/marcas.interface';
import { Categorias } from '../../../../models/categorias.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'formulario-actualizar_completo',
  imports: [],
  templateUrl: './formulario-actualizar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioActualizarComponent {
  productService = inject(ProductoApiService);//verificar si es necesario que use los servicios de marca y categoria
  marcaService = inject(MarcaServiceService);
  categoriaService = inject(CategoriaServiceService);
  private toastr = inject(ToastrService);
  modalService=inject(ModalService);

  listaMarcas = this.marcaService.listaMarcas;
  listaCategorias = this.categoriaService.categorias;
  listaEstados = ['disponible', 'agotado'];

  productoActual = this.productService.productoActualizar;

  //atributos para manejar los datos del formulario
  nuevaDescripcion=signal<string>(this.productoActual().descripcion);
  descripcion = signal<string>(this.productoActual().descripcion);
  categoria = signal<string>(this.productoActual().categoria);
  marca = signal<string>(this.productoActual().marca);
  costo = signal<string>(this.productoActual().costo.toString());
  cantidad = signal<string>(this.productoActual().cantidad.toString());
  precio = signal<string>(this.productoActual().precio.toString());

  private buscarMarca(marcas: string): boolean {
    console.log(this.listaMarcas());
    const marca = this.listaMarcas().find((marca) => (marca.nombre == marcas));
    if (marca) {
      return true;
    } else {
      return false;
    }
  }
  private buscarCategoria(categorias: string): boolean {
    console.log(this.listaCategorias());
    console.log(categorias);
    const caregoria = this.listaCategorias().find((caregoria) => (caregoria.nombre == categorias));
    if (caregoria) {
      return true;
    } else {
      return false;
    }
  }

  // private buscarEstado(estados: string): boolean {
  //   const id = this.listaEstados.find(estado => (estado == estados));
  //   if (id) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }


  public obtenerMarcas(): void {
    this.marcaService.getMarcas().subscribe((resp) => {
      const listaMarcas: Marca[] = resp.map((marca) => ({
        id: marca.id,
        nombre: marca.nombre,
        estado: marca.estado
      }));
      this.marcaService.listaMarcas.set(listaMarcas);
    });
  }

  public obtenerCategorias(): void {
    this.categoriaService.getCategorias().subscribe((resp) => {
      const listaCategorias: Categorias[] = resp.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre
      }));
      this.categoriaService.categorias.set(listaCategorias);
    });
  }


  ngOnInit(): void {
    this.obtenerMarcas();
    this.obtenerCategorias();
  }


  public actualizarProducto(event: Event) {
    event.preventDefault();
    if (!this.buscarMarca(this.marca())) {
      alert('Marca no disponible');
      return;
    }

    const nuevaDescripcion:string=this.nuevaDescripcion();
    const descripcion: string = this.descripcion();
    const categoria: string = this.categoria();
    const marca = this.marca();
    const costo: number = +this.costo();
    const cantidad: number = +this.cantidad();
    const precio: number = +this.precio();

    this.productService.actualizarProductoWithInventario(descripcion,nuevaDescripcion, categoria , marca, costo, cantidad, precio).subscribe({
      next: (response: any) => {
        console.log(response);
        console.log('entra');
        //if (response?.detail == 'Producto actualizado correctamente.') {
          this.toastr.success('Producto registrado exitosamente');
        // } else {
        //   this.toastr.error('No se pudo registrar el producto');
        // }

      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail ||
          e.error?.message ||
          "Error al registrar un producto";

        this.toastr.error(errorMessage, 'Error', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000// Nota que se usa 'timeOut' en lugar de 'timeout'
        });
      }
    });
    this.modalService.mostrarActualizarProductoSwitch();
  }
}
