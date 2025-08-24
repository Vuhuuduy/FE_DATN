export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  status: boolean; // true = hoạt động, false = khóa
}
