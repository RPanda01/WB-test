export interface WBTariff {
  warehouse_name: string;
  box_type: string;
  price: number;
  date: string;
}

export interface TariffRecord extends WBTariff {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface WBApiResponse {
  response: {
    data: {
      warehouseList: Array<{
        warehouseName: string;
        boxTypeName: string;
        price: number;
      }>;
    };
  };
}