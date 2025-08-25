

export interface IVariant {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  sku: string;
  format: string;
  price: number;
  stock_quantity: number;
  image_URL?: string;
  color?: string;
  size?: string;
  name? : string;
}
