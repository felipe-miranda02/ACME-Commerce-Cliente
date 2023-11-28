export interface Empresa {}

export interface EmpresaDto {
  id: number;
  nombre: string;
  uri: string;
  image?: string;
  puntuacionDeSostenibilidad?: number;
  lookAndFeel?: LookAndFeel;
}

export interface LookAndFeel {
  id: string;
  imagenBanner?: string;
  paletaDeColores: string;
}

export interface CentroPickUp {
  id: number;
  nombre: string;
  direccionFormateada: string;
  latitud?: any;
  longitud?: any;
  position: {
    lat: number;
    lng: number;
  };
}

export interface ServicioEntrega {
  id: number;
  nombre: string;
  velocidad: string;
  costo: number;
  seguimiento: string;
  huellaDeCarbono: number;
}
