export interface Company {
  id: string;
  userId: string;
  active: boolean;
  isPublic: boolean;
  title: string;
  addrZip: string;
  addrCity: string;
  addrStreet: string;
  isMeter: boolean;
  transactionType: number;
}
