import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductoApiService } from '../../services/productoApi.service';
import { ProductoListComponentComponent } from "../components/products/productoListComponent/productoListComponent.component";
import { FormularioCrearComponent } from "../components/products/formulario-crear/formulario-crear.component";
import { ModalService } from '../../services/modal.service';
import { ModalSingleProductoComponent } from "../components/products/modal-single-producto/modal-single-producto.component";
import { FormularioActualizarComponent } from "../components/products/formulario-actualizar/formulario-actualizar.component";
import { Productos } from '../../models/productos.interface';
import { ImagenesServiceService } from '../../services/imagenesService.service';

@Component({
  selector: 'app-productos-page',
  imports: [ProductoListComponentComponent, FormularioCrearComponent, ModalSingleProductoComponent, FormularioActualizarComponent],
  templateUrl: './productos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosPageComponent {
  productService = inject(ProductoApiService);
  imagenService=inject(ImagenesServiceService);
  //generarReporteClase=inject(ReporteProductosComponent);
  //propiedad para manejar la categoria
  categoria = signal<string>('');

  marca = signal<string>('');

  producto = signal<string>('');

  modalService = inject(ModalService);



  lista = computed(() => (this.productService.productList()));
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


  public mostrarProductos() {
    // this.contarActivos();

  }
  ngOnInit(): void {
    this.productService.getAllProducts();
    this.imagenService.obtenerTodasLasImagenes();
  }

  exportPDF() {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Título y Fecha
    doc.setFontSize(16);
    doc.text('Reporte de Productos', 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaStr}`, 14, 22);

    // Encabezados
    const encabezados = [
      ['ID', 'Descripción', 'Costo', 'Marca', 'Categoría', 'Cantidad', 'Precio', 'Estado']
    ];

    // Cuerpo de la tabla
    const filas = this.lista().map((p: Productos) => [
      p.id,
      p.descripcion,
      p.costo,
      p.marca,
      p.categoria,
      p.cantidad,
      p.precio,
      p.estado
    ]);

    // Generar tabla
    autoTable(doc, {
      startY: 28,
      head: encabezados,
      body: filas,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] }, // color azul
    });

    // Guardar PDF
    doc.save('reporte_productos.pdf');
  }
}
