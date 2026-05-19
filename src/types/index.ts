export type ProductCategory =
  | 'remera'
  | 'camisa'
  | 'pantalon'
  | 'jean'
  | 'vestido'
  | 'pollera'
  | 'shorts'
  | 'campera'
  | 'abrigo'
  | 'conjunto'
  | 'calzado'
  | 'accesorio'
  | 'otro';

export type ProductGender = 'mujer' | 'hombre' | 'unisex' | 'nino' | 'nina';

export type ProductCondition = 'nuevo' | 'como-nuevo' | 'muy-buen-estado' | 'buen-estado';

export type ProductSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL'
  | '34'
  | '36'
  | '38'
  | '40'
  | '42'
  | '44'
  | '46'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | 'unico';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  gender: ProductGender;
  size: string;
  color: string;
  condition: ProductCondition;
  price: number;
  description: string;
  images: string[];
  available: boolean;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface Filters {
  category: string;
  gender: string;
  size: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  shippingMethod: 'uber-moto' | 'correo-argentino';
  notes: string;
}
