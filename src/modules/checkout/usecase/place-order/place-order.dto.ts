import Invoice from "../../../invoice/domain/entity/invoice";

export interface PlaceOrderInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}
