export interface Budget {
  id: string;
  userId: string;
  active: boolean;
  budgetType: number;
  currency: string;
  title: string;
  openingBalance: number;
  accountNumber: string;
  creditCardNumber: string;
  comment: string;
}
