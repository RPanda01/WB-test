import { TariffModel } from '#postgres/models/tariffs.js';
import { WBTariff } from '#types/tariffs.js';

export class DBTariffsService {
  async saveTariffs(tariffs: WBTariff[]): Promise<void> {
    try {
      console.log(`Сохранение ${tariffs.length} тарифов в БД...`);
      
      await TariffModel.bulkInsert(tariffs);
      
      console.log('Тарифы успешно сохранены в БД');
    } catch (error) {
      console.error('Ошибка сохранения тарифов в БД:', error);
      throw error;
    }
  }

  async getTodayTariffs(): Promise<WBTariff[]> {
    const today = new Date().toISOString().split('T')[0];
    return TariffModel.getByDate(today);
  }

  async getLatestTariffs(): Promise<WBTariff[]> {
    return TariffModel.getLatest();
  }
}