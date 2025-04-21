import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { Categorias } from '../../../../models/categorias.interface';
import { CategoriaComponent } from "../../categoria/categoria/categoria.component";

@Component({
  selector: 'lista-categoria-inventario',
  imports: [CategoriaComponent],
  templateUrl: './lista-categoria.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaCategoriaComponent {
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
