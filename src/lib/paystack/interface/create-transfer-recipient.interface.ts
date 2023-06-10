export interface ICreateRecipient {
  status: boolean;
  message: string;
  data: Data;
}

export interface Data {
  active: boolean;
  createdAt: string;
  currency: string;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  details: Details;
}

export interface Details {
  authorization_code: any;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
}
