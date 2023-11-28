export interface RealizarPagoDto {
  orden_id: number;
  cliente_id: string;
  direccion_id: number;
  servicio_entrega_id: number | null;
  metodo_pago?: number;
}
