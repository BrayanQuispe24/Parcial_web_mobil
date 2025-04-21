import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ListaProductosComponent } from "../components/inventario/lista-productos/lista-productos.component";
import { ModalService } from '../../services/modal.service';
import { ProductoApiService } from '../../services/productoApi.service';
import { ListaCategoriaComponent } from "../components/inventario/lista-categoria/lista-categoria.component";
import { CategoriaServiceService } from '../../services/categoriaService.service';
import { ToastrService } from 'ngx-toastr';
import { Categorias } from '../../models/categorias.interface';
import { MarcaServiceService } from '../../services/marcaService.service';
import { Marca } from '../../models/marcas.interface';
import { ListaMarcasComponent } from "../components/inventario/lista-marcas/lista-marcas.component";
import { ImagenesServiceService } from '../../services/imagenesService.service';

@Component({
  selector: 'inventario-page',
  imports: [ListaProductosComponent, ListaCategoriaComponent, ListaMarcasComponent],
  templateUrl: './inventario-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioPageComponent {
  productService = inject(ProductoApiService);
  imagenService=inject(ImagenesServiceService);
  //propiedad para manejar la categoria
  categoria = signal<string>('');

  marca = signal<string>('');

  producto = signal<string>('');

  modalService = inject(ModalService);

  private lista = computed(() => (this.productService.productList()));
  public cantidadDeProductos = computed(() => (this.productService.productList().length));
  cantidadDisponible = computed(() =>
    this.lista().filter(p => p.estado === 'disponible').length
  );
  cantidadAgotados = computed(() =>
    this.lista().filter(p => p.estado === 'agotado').length
  );

  public mostrarProductoWithCategoria(): void {
    const categoria = this.categoria();
    this.productService.obtenerProductosPorCategoria(categoria);
  }

  public mostrarProductoWithMarca(): void {
    const marca = this.marca();
    this.productService.obtenerProductosPorMarca(marca);
  }

  public buscarProdcutoPorNombre(): void {
    const producto: string = this.producto();
    this.productService.obtenerProductoByNombre(producto);

    this.modalService.mostrarSingleProductoSwitch();
  }
  //categorias y marcas
  private categoriaService = inject(CategoriaServiceService);
  public modalSingleCategoria = inject(ModalService);
  public modalActualizarCategoria = inject(ModalService);
  private toastr = inject(ToastrService);
  public nombre = signal<string>('');//este nombre se usara para buscar a la categoria

  public cantidad = computed(() => (this.categoriaService.categorias().length));

  public obtenerCategorias(): void {
    this.categoriaService.getCategorias().
      subscribe((resp) => {
        const listaCategorias: Categorias[] = resp.map((categoria) => {
          const category: Categorias = {
            id: categoria.id,
            nombre: categoria.nombre
          }
          return category;
        });
        this.categoriaService.categorias.set(listaCategorias);
        //localStorage.setItem('lista_categoria', JSON.stringify(listaCategorias))
      })
  }

  // public buscarCategoria(): void {
  //   const nombre: string = this.nombre();
  //   const categoria: Categorias | undefined = this.categoriaService.categorias().find((categoria) => (categoria.nombre === nombre));
  //   if (categoria) {
  //     this.toastr.success('Categoria encontrada');
  //     this.categoriaService.categoriaActual.set(categoria);
  //     setTimeout(() => {
  //       this.modalSingleCategoria.mostrarSingleCategoriaSwitch();
  //       this.nombre.set('');
  //     }, 200);
  //   } else {
  //     this.toastr.error('La categoria no fue encontrada!');
  //   }
  // }

  // marcas
  private marcaService = inject(MarcaServiceService);


  public nombreMarca = signal<string>('');//este nombre se usara para buscar a la marca

  public cantidadMarca = computed(() => (this.marcaService.listaMarcas().length));

  private listaMarca = computed(() => (this.marcaService.listaMarcas()));
  cantidadActivos = signal(0);
  cantidadEliminados = signal(0);

  // public contarActivos() {
  //   // Reiniciar contadores
  //   this.cantidadActivos.set(0);
  //   this.cantidadEliminados.set(0);

  //   // Contar según el estado
  //   this.lista().forEach(marca => {
  //     if (marca.estado) {
  //       this.cantidadActivos.set(this.cantidadActivos() + 1);
  //     } else {
  //       this.cantidadEliminados.set(this.cantidadEliminados() + 1);
  //     }
  //   });
  // }



  constructor() {

  }
  public obtenerMarcas(): void {
    this.marcaService.getMarcas().subscribe((resp) => {
      const listaMarcas: Marca[] = resp.map((marca) => {
        const marcaActual: Marca = {
          id: marca.id,
          nombre: marca.nombre,
          estado: marca.estado
        };
        return marcaActual;
      });

      this.marcaService.listaMarcas.set(listaMarcas);

      // Actualiza los contadores
     // this.contarActivos();
    });
  }


  // public buscarMarca(): void {
  //   const nombre: string = this.nombre();
  //   const marca: Marca | undefined = this.marcaService.listaMarcas().find((marca) => (marca.nombre === nombre));
  //   if (marca) {
  //     this.toastr.success('Marca encontrada');
  //     this.marcaService.marcaActual.set(marca);
  //     setTimeout(() => {
  //       this.modalService.mostrarSingleMarcaSwitch();
  //       this.nombre.set('');
  //     }, 200);
  //   } else {
  //     this.toastr.error('La Marca no fue encontrada!');
  //   }
  // }

  ngOnInit(): void {
    this.productService.getAllProducts();
    this.obtenerCategorias();
    this.obtenerMarcas();
    this.imagenService.obtenerTodasLasImagenes();
  }
}
