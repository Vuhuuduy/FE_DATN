export interface IDiscounts {
  _id: string
  code: string
  discount_type: '%' | 'vnd'
  discount_value: number
  minOrderValue: number
  date: string[]
  status: 'active' | 'inactive'
  
}
