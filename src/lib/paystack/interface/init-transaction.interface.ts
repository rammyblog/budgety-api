export interface IInitTransaction {
  status: boolean;
  message: string;
  data: IData;
}

interface IData {
  authorization_url: string;
  access_code: string;
  reference: string;
}
