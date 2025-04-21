import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'categoria-singlemodal',
  imports: [],
  templateUrl: './categoriaSinglemodal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaSinglemodalComponent {
  public categoriaService = inject(CategoriaServiceService);
  public modalService=inject(ModalService);

  id = computed(() => this.categoriaService.categoriaActual()?.id);
  nombre = computed(() => this.categoriaService.categoriaActual()?.nombre);

}
