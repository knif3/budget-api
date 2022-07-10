export interface User {
  id: string;
  login: string;
  email: string;
  password: string;
  isDeleted: boolean;
  createdDate?: string;
  updatedDate?: string;
}
