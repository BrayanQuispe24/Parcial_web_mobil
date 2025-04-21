import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { Marca } from '../../../../models/marcas.interface';
import { MarcaComponent } from "../../marcas/marca/marca.component";

@Component({
  selector: 'lista-marcas-marcas',
  imports: [MarcaComponent],
  templateUrl: './lista-marcas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaMarcasComponent {

  marcaService = inject(MarcaServiceService);

  //lista de categorias
  listaMarcas = this.marcaService.listaMarcas;

  constructor() {

  }

  ngOnInit(): void {
    this.obtenerMarcas();
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
}
