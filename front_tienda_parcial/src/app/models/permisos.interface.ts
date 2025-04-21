export interface Permisos {
  crear: boolean
  eliminar: boolean
  actualizar: boolean
  ver: boolean
  usuario_id: number|undefined
}

export interface Permiso {
  crear: boolean
  eliminar: boolean
  actualizar: boolean
  ver: boolean
}
