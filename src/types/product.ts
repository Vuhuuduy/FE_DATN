
import { IVariant } from "../types/variants";
export interface IProduct {
  _id?: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
  status:string
   stock:number
   variants?: IVariant[]; 
}
// Nếu muốn sản phẩm có luôn danh sách biến thể
export type IProductWithVariants = IProduct & {
  variants: IVariant[];
};

