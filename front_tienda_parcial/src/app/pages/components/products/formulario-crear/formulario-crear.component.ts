import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProductoApiService } from '../../../../services/productoApi.service';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Marca } from '../../../../models/marcas.interface';
import { Categorias } from '../../../../models/categorias.interface';

@Component({
  selector: 'formulario-producto-crear',
  imports: [],
  templateUrl: './formulario-crear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCrearComponent {

  productService = inject(ProductoApiService);//verificar si es necesario que use los servicios de marca y categoria
  marcaService = inject(MarcaServiceService);
  categoriaService = inject(CategoriaServiceService);
  private toastr = inject(ToastrService);

  listaMarcas = this.marcaService.listaMarcas;
  listaCategorias = this.categoriaService.categorias;
  listaEstados = ['disponible', 'agotado'];

  //atributos para manejar los datos del formulario
  descripcion = signal<string>('');
  estado = signal<string>('');
  categoria = signal<string>('');
  marca = signal<string>('');
  costo = signal<string>('');
  cantidad = signal<string>('');
  precio = signal<string>('');

  private buscarIdMarca(marcas: string): any {
    console.log(this.listaMarcas());
    const marca = this.listaMarcas().find((marca) => (marca.nombre.toLowerCase() === marcas));
    if (marca) {
      return marca.id;
    } else {
      return 'Marca no encontrada';
    }
  }
  private buscarIdCategoria(categorias: string): number {
     console.log(this.listaCategorias());
     console.log(categorias);
    const caregoria = this.listaCategorias().find((caregoria) => (caregoria.nombre.toLowerCase() == categorias));
    if (caregoria) {
      return caregoria.id;
    } else {
      return 0;
    }
  }

  private buscarEstado(estados: string): boolean {
    const id = this.listaEstados.find(estado => (estado == estados));
    if (id) {
      return true;
    } else {
      return false;
    }
  }


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


  public registrarProducto(event: Event) {
    event.preventDefault();
    if (!this.buscarEstado(this.estado())) {
      alert('Estado no disponible,opciones: disponible o agotado');
      return;
    }
    const descripcion: string = this.descripcion();
    console.log(descripcion);
    const estado: string = this.estado();
    const categoria = this.buscarIdCategoria(this.categoria().toLowerCase());
    if (categoria < 1) {
      alert('Categoria no disponible');
      return;
    }
    const marca = this.buscarIdMarca(this.marca());
    if (marca == 'Marca no encontrada') {
      alert('Marca no disponible');
      return;
    }
    const costo: number = +this.costo();
    const cantidad: number = +this.cantidad();
    const precio: number = +this.precio();

    this.productService.registrarProductoWithInventario(descripcion, estado, categoria, marca, costo, cantidad, precio).subscribe({
      next: (response: any) => {
        console.log(response);
        console.log('entra');
        if (response?.detail === 'Producto creado correctamente.') {
          this.toastr.success('Producto registrado exitosamente');
        } else {
          this.toastr.error('No se pudo registrar el producto');
        }

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
  }

}
