import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../services/modal.service';

import { MarcaListComponent } from '../components/marcas/marcaList/marcaList.component';
import { MarcaServiceService } from '../../services/marcaService.service';
import { Marca } from '../../models/marcas.interface';
import { FormularioCrearComponent } from "../components/marcas/formularioCrear/formularioCrear.component";
import { ModalActualizarComponent } from "../components/categoria/modal-actualizar/modal-actualizar.component";
import { FormularioActualizarComponent } from "../components/marcas/formularioActualizar/formularioActualizar.component";
import { MarcaSingleModalComponent } from "../components/marcas/marcaSingleModal/marcaSingleModal.component";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'marca-page',
  imports: [MarcaListComponent, FormularioCrearComponent, FormularioActualizarComponent, MarcaSingleModalComponent],
  templateUrl: './marca-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcaPageComponent {

  private marcaService = inject(MarcaServiceService);

  public modalService = inject(ModalService);

  private toastr = inject(ToastrService);

  public nombre = signal<string>('');//este nombre se usara para buscar a la marca

  public cantidad = computed(() => (this.marcaService.listaMarcas().length));

  private lista = computed(() => (this.marcaService.listaMarcas()));
  cantidadActivos = signal(0);
  cantidadEliminados = signal(0);

  public contarActivos() {
    // Reiniciar contadores
    this.cantidadActivos.set(0);
    this.cantidadEliminados.set(0);

    // Contar según el estado
    this.lista().forEach(marca => {
      if (marca.estado) {
        this.cantidadActivos.set(this.cantidadActivos() + 1);
      } else {
        this.cantidadEliminados.set(this.cantidadEliminados() + 1);
      }
    });
  }



  constructor() {

  }

  ngOnInit(): void {
    this.obtenerMarcas();
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
      this.contarActivos();
    });
  }


  public buscarMarca(): void {
    const nombre: string = this.nombre();
    const marca: Marca | undefined = this.marcaService.listaMarcas().find((marca) => (marca.nombre === nombre));
    if (marca) {
      this.toastr.success('Marca encontrada');
      this.marcaService.marcaActual.set(marca);
      setTimeout(() => {
        this.modalService.mostrarSingleMarcaSwitch();
        this.nombre.set('');
      }, 200);
    } else {
      this.toastr.error('La Marca no fue encontrada!');
    }
  }

  exportPDF() {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Encabezado de la tabla de detalle
    const encabezados = [['ID', 'Nombre', 'Estado']];
    const filas = this.lista().map((m: Marca) => [
      m.id,
      m.nombre,
      m.estado ? 'Activo' : 'Inactivo'
    ]);

    // Cálculo de totales
    const total = this.lista().length;
    const activos = this.lista().filter(m => m.estado).length;
    const inactivos = total - activos;

    const resumenEncabezados = [['Total Marcas', 'Activas', 'Inactivas']];
    const resumenCuerpo = [[total, activos, inactivos]];

    let finalY = 0;

    // Tabla de resumen
    autoTable(doc, {
      head: resumenEncabezados,
      body: resumenCuerpo,
      startY: 28,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 139, 34] }, // verde
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text('Reporte de Marcas', 14, 15);
        doc.setFontSize(10);
        doc.text(`Fecha: ${fechaStr}`, 14, 22);
        finalY = data.cursor?.y ?? 40;
      }
    });

    // Tabla de detalle
    autoTable(doc, {
      startY: finalY + 10,
      head: encabezados,
      body: filas,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] }, // azul
    });

    doc.save('reporte_marcas.pdf');
  }

}
