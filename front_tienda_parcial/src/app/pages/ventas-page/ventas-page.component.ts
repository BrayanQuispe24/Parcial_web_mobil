import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ListaFacturasComponent } from "../components/ventas-facturas/lista-facturas/lista-facturas.component";
import { VentasServiceService } from '../../services/ventasService.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Facturas } from '../../models/factura.interface';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-ventas-page',
  imports: [ListaFacturasComponent],
  templateUrl: './ventas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasPageComponent {
  facturaService = inject(VentasServiceService);
  lista = computed(() => (this.facturaService.listaFacturas()));
  fechaInicio=signal<string>('');
  fechaFinal=signal<string>('');




public mostrarI(){
  console.log(this.fechaInicio(),this.fechaFinal());
}





  exportPDFFacturas() {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Título y Fecha
    doc.setFontSize(16);
    doc.text('Reporte de Facturas', 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaStr}`, 14, 22);

    // Totales
    let totalGeneral = 0;
    const totalPorEstado: { [estado: string]: number } = {};

    // Cuerpo
    const filas = this.lista().map((f: Facturas) => {
      totalGeneral += f.total;

      if (!totalPorEstado[f.estado]) {
        totalPorEstado[f.estado] = 0;
      }
      totalPorEstado[f.estado] += f.total;

      return [
        f.id,
        f.fecha,
        f.total.toFixed(2),
        f.estado,
        f.metodo_id,
        f.cliente_id
      ];
    });

    // Mostrar totales antes de la tabla
    let y = 30;
    doc.setFontSize(12);
    doc.text(`Total General de Ventas: $${totalGeneral.toFixed(2)}`, 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.text('Totales por Estado:', 14, y);
    y += 6;

    for (const estado in totalPorEstado) {
      const monto = totalPorEstado[estado];
      doc.text(`- ${estado}: $${monto.toFixed(2)}`, 20, y);
      y += 6;
    }

    // Tabla principal debajo de los totales
    autoTable(doc, {
      startY: y + 5,
      head: [['ID', 'Fecha', 'Total', 'Estado', 'Método ID', 'Cliente ID']],
      body: filas,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 150, 136] },
    });

    // Guardar
    doc.save('reporte_facturas.pdf');
  }

exportarFacturasAExcel() {

  const fechaInicio:string=this.fechaInicio();
  const fechaFin:string=this.fechaFinal();
  // Filtrar las facturas según el rango de fechas
  const facturasFiltradas = this.lista().filter(factura => {
    const fechaFactura = new Date(factura.fecha);
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return fechaFactura >= inicio && fechaFactura <= fin;
  });

  // Si no hay facturas en el rango de fechas, mostramos un mensaje
  if (facturasFiltradas.length === 0) {
    console.log('No se encontraron facturas en este rango de fechas');
    return;
  }

  // Mapeamos los datos a los encabezados deseados
  const encabezados = [
    { id: 'id', label: 'ID Factura' },
    { id: 'fecha', label: 'Fecha' },
    { id: 'total', label: 'Total' },
    { id: 'estado', label: 'Estado' },
    { id: 'metodo_id', label: 'Método de Pago' },
    { id: 'cliente_id', label: 'ID Cliente' }
  ];

  // Preparamos los datos para la exportación
  const datosExportados = facturasFiltradas.map(factura => ({
    'ID Factura': factura.id,
    'Fecha': factura.fecha,
    'Total': factura.total,
    'Estado': factura.estado,
    'Método de Pago': factura.metodo_id,
    'ID Cliente': factura.cliente_id
  }));

  // Creamos la hoja de trabajo
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportados, {
    header: encabezados.map(e => e.label),
  });

  // Creamos el libro de trabajo
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Facturas': worksheet },
    SheetNames: ['Facturas']
  };

  // Convertimos a array de bytes para el archivo Excel
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  // Creamos el blob para descargar el archivo
  const data: Blob = new Blob([excelBuffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  // Usamos FileSaver para descargar el archivo Excel
  FileSaver.saveAs(data, `facturas_${new Date().getTime()}.xlsx`);
}


//-------------------------------------------PARA EXPORTAR REPORTES EN EXCEL


ngOnInit(): void {
  this.facturaService.obtenerTodasLasFacturas();
}

 }
