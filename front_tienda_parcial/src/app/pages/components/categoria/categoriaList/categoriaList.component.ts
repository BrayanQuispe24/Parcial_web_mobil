import { Categorias } from './../../../../models/categorias.interface';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CategoriaComponent } from "../categoria/categoria.component";
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal.service';


@Component({
  selector: 'categoria-list',
  imports: [CategoriaComponent],
  templateUrl: './categoriaList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaListComponent {

  categoriaService = inject(CategoriaServiceService);

  //lista de categorias
  listaCategorias = this.categoriaService.categorias;

  constructor() {

  }

  ngOnInit(): void {
    this.obtenerCategorias();
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

}
