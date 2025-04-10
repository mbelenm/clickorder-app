export namespace ModelsTienda {
  export const pathCategories = 'Categories';
  export const pathProducts = 'Products';
  export const folderProducts= 'products';
  
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
}
