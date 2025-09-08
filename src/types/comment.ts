export interface IReply {
  _id: string;
  userId: {
    _id: string;
    fullname: string;
  };
  content: string;
  createdAt: string;
}

export interface IComment {
  _id: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
  };
  userId: {
    _id: string;
    fullname: string;
    email?: string;
  };
  content: string;
  rating: number;
  helpful: number;
  replies: IReply[];
  isHidden: boolean;   // 👈 thêm field này để ẩn/hiện
  createdAt: string;
  updatedAt: string;
}
