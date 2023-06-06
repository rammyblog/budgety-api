export interface IVerifyAccountNumber {
  status: boolean;
  message: string;
  data: IData;
}

interface IData {
  account_number: string;
  account_name: string;
  bank_id: string;
}
