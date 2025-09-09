export interface IReply {
  _id: string;
  userId: {
    _id: string;
    fullname: string;
  };
  content: string;
  replyTo?: {
    _id: string;
    content?: string;
    userId: {
      _id: string;
      fullname: string;
    };
  } | null;
  parentCommentId?: string;
  parentContent?: string; 
  parentUser?: string;    
  createdAt: string;
    isHidden: boolean; 
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
  createdAt: string;
  updatedAt: string;
    isHidden: boolean; 
}
