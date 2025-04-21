import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { Marca } from '../../../../models/marcas.interface';
import { MarcaComponent } from "../marca/marca.component";

@Component({
  selector: 'marca-list',
  imports: [MarcaComponent],
  templateUrl: './marcaList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcaListComponent {

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
        estado:marca.estado
      }));
      this.marcaService.listaMarcas.set(listaMarcas);
    });
  }
 }
