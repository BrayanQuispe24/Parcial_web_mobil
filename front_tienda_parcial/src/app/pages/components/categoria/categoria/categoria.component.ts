import { Categorias } from './../../../../models/categorias.interface';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-categoria',
  imports: [],
  templateUrl: './categoria.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaComponent {

  categoriaService = inject(CategoriaServiceService);
  modalActulizarService = inject(ModalService);

  categoria = input<Categorias>();
  id = computed(() => this.categoria()?.id);
  nombre = computed(() => this.categoria()?.nombre);


  public actualizarCategoria(): void {
    console.log('Click ejecutado');
    console.log(this.categoria());
    const categoria = this.categoria() || { id: 1, nombre: 'xD' };
    this.categoriaService.categoriaActualizar.set(categoria);
      this.modalActulizarService.mostrarActaulizacionCategoriaSwitch();
  }
}
