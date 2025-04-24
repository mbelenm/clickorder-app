import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
//import { InfoPedido, DatosUserPedido, Pedido } from '../../../functions/src/models';
export namespace ModelsTienda {
  export const pathCategories = 'Categories';
  export const pathProducts = 'Products';
  export const folderProducts= 'products';
  export const pathPedidos = 'pedidos';

  export interface Category {
    id?: string;
    name: string;
    description: string;

  }
  export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    images: string[];
    enlacePermanente?: string;
  }
  export interface Carrito {
    items: ItemCarrito[];
    total: number;
    cant: number;
 }
 export interface ItemCarrito {
  cant: number;
  product: Product;

}



export interface InfoPedido {
  datos:DatosUserPedido
  fechaEntrega: Date;
  direccionEntrega: DireccionPedido;

}

export interface DatosUserPedido  {
  id?: string;
  name: string;
  mail: string
  phone: string;
}

export interface DireccionPedido {
  coordinate: LatLng
  referencia: string;

}

export interface Pedido {
  carrito?: Carrito;
  info: InfoPedido;
  id?: string;
  date?: any;
  uid: string;
  state:StatePedido;
  motorizado?: {
    uid: string;
    name: string;
    coordinate: LatLng
  };


}

export type StatePedido = 'Nuevo' | 'Pedido' | 'Asignado' | 'En Camino' | 'Entregado' | 'Cancelado' ;

export const StepsPedido: StatePedido[] = ['Nuevo', 'Pedido', 'Asignado', 'En Camino', 'Entregado'];

export const StepsPedidoMotorizado: StatePedido[] = ['Asignado', 'En Camino', 'Entregado'];


}
