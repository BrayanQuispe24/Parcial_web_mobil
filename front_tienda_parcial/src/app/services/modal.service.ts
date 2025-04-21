import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalCreateUser = signal<boolean>(true);
  modalUpdateUser = signal<boolean>(true);
  modalSearchedUser = signal<boolean>(true);
  mostrarUsuarioBuscado = signal<boolean>(true);
  modalAsignacionPermisos = signal<boolean>(true);

  modalActualizarCategoria = signal<boolean>(true);
  modalSingleCategoria = signal<boolean>(true);

  modalActualizarMarca = signal<boolean>(true);
  modalSingleMarca = signal<boolean>(true);

  modalSingleProducto = signal<boolean>(true);
  modalActualizarproducto = signal<boolean>(true);

  modalSinglePersonal = signal<boolean>(true);
  modalActualizarPersonal = signal<boolean>(true);

  modalActualizarCliente=signal<boolean>(true);
  modalSingleCliente=signal<boolean>(true);

  modalExportPdf=signal<boolean>(true);

  public modalExportSwitch(){
    this.modalExportPdf.set(!this.modalExportPdf());
  }

  public switchBandera(bandera: boolean){
    return !bandera;
  }

  public showModalCreateSwitch() {
    this.modalCreateUser.set(!this.modalCreateUser());
  }

  public showModalUpdateSwitch() {
    this.modalUpdateUser.set(!this.modalUpdateUser());
  }

  public showModalSearchedUserSwitch() {
    this.modalSearchedUser.set(!this.modalSearchedUser());
  }

  public mostrarUsuarioBuscadoSwitch() {
    this.mostrarUsuarioBuscado.set(!this.mostrarUsuarioBuscado());

  }
  public mostrarAsignacionPermisosSwitch() {
    this.modalAsignacionPermisos.set(!this.modalAsignacionPermisos());
  }


  public mostrarActaulizacionCategoriaSwitch() {
    this.modalActualizarCategoria.set(!this.modalActualizarCategoria());
  }
  public mostrarSingleCategoriaSwitch() {
    this.modalSingleCategoria.set(!this.modalSingleCategoria());
  }


  public mostarActualizacionMarcaSwitch() {
    this.modalActualizarMarca.set(!this.modalActualizarMarca());
  }
  public mostrarSingleMarcaSwitch() {
    this.modalSingleMarca.set(!this.modalSingleMarca());
  }

  public mostrarSingleProductoSwitch() {
    this.modalSingleProducto.set(!this.modalSingleProducto());
  }
  public mostrarActualizarProductoSwitch() {
    this.modalActualizarproducto.set(!this.modalActualizarproducto());
  }

  public mostrarSinglePersonalSwitch() {
    this.modalSinglePersonal.set(!this.modalSinglePersonal());
  }
  public mostrarActualizarPersonalSwitch() {
    this.modalActualizarPersonal.set(!this.modalActualizarPersonal());
  }

  public mostrarSingleClienteSwitch() {
    this.modalSingleCliente.set(!this.modalSingleCliente());
  }
  public mostrarActualizarClienteSwitch() {
    this.modalActualizarCliente.set(!this.modalActualizarCliente());
  }

  constructor() { }

}
