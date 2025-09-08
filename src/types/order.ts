export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
 
  image?: string;
}

export interface IShippingInfo {
  fullName: string; // giữ nguyên vì API trả "fullName"
  address: string;
  phone: string;
  email?: string;
  note?: string;
}

export interface IUserShort {
  _id: string;
  fullname: string;
  email: string;
}

export interface ICouponShort {
  _id: string;
  code: string;
  value: number;
}

export interface IOrder {
  _id: string;
  userId: IUserShort;
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đang giao hàng" | "Đã hủy" | "Đã hoàn thành" | "Đã hoàn tiền";
  couponId?: string | ICouponShort | null;
  discountAmount: number;
  orderItems: IOrderItem[];
  shippingInfo: IShippingInfo;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
   cancelReason?: string | null; 

  // ✅ Thêm mới
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
}
