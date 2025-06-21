import axios from 'axios';
import env from '#config/env/env.js';
import { WBApiResponse, WBTariff } from '#types/tariffs.js';

export class WBTariffsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://suppliers-api.wildberries.ru';

  constructor() {
    this.apiKey = env.WB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('WB_API_KEY не найден в переменных окружения');
    }
  }

  async fetchTariffs(): Promise<WBTariff[]> {
    try {
      const response = await axios.get<WBApiResponse>(`${this.baseUrl}/api/v3/tariffs/box`, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      const today = new Date().toISOString().split('T')[0];
      
      return response.data.response.data.warehouseList.map(item => ({
        warehouse_name: item.warehouseName,
        box_type: item.boxTypeName,
        price: item.price,
        date: today
      }));
    } catch (error) {
      console.error('Ошибка получения тарифов WB:', error);
      throw new Error('Не удалось получить тарифы от WB API');
    }
  }
}