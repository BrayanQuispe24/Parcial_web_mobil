import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoriaListComponent } from "../components/categoria/categoriaList/categoriaList.component";
import { FormularioComponent } from "../components/categoria/formulario/formulario.component";
import { CategoriaServiceService } from '../../services/categoriaService.service';
import { Categorias } from '../../models/categorias.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ModalActualizarComponent } from "../components/categoria/modal-actualizar/modal-actualizar.component";
import { ModalService } from '../../services/modal.service';
import { CategoriaSinglemodalComponent } from "../components/categoria/categoriaSinglemodal/categoriaSinglemodal.component";

@Component({
  selector: 'categoria-page',
  imports: [CategoriaListComponent, FormularioComponent, ModalActualizarComponent, CategoriaSinglemodalComponent],
  templateUrl: './categoria-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaPageComponent {
  private categoriaService = inject(CategoriaServiceService);
  public modalSingleCategoria = inject(ModalService);
  public modalActualizarCategoria = inject(ModalService);
  private toastr = inject(ToastrService);
  public nombre = signal<string>('');//este nombre se usara para buscar a la categoria

  public cantidad = computed(()=>(this.categoriaService.categorias().length));

  constructor() {

  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }


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

  public buscarCategoria(): void {
    const nombre: string = this.nombre();
    const categoria: Categorias | undefined = this.categoriaService.categorias().find((categoria) => (categoria.nombre === nombre));
    if (categoria) {
      this.toastr.success('Categoria encontrada');
      this.categoriaService.categoriaActual.set(categoria);
      setTimeout(() => {
        this.modalSingleCategoria.mostrarSingleCategoriaSwitch();
        this.nombre.set('');
      }, 200);
    } else {
      this.toastr.error('La categoria no fue encontrada!');
    }
  }

}
