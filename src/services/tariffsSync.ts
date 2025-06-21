import { WBTariffsService } from '#services/wbTariffs.js';
import { DBTariffsService } from '#services/dbTariffs.js';
import { GoogleSheetsService } from '#services/googleExport.js';

export class TariffsSyncService {
  private wbService: WBTariffsService;
  private dbService: DBTariffsService;
  private googleService: GoogleSheetsService;

  constructor() {
    this.wbService = new WBTariffsService();
    this.dbService = new DBTariffsService();
    this.googleService = new GoogleSheetsService();
  }

  async syncTariffs(): Promise<void> {
    try {
      console.log('Начало синхронизации тарифов...');

      // 1. Получение данных от WB API
      const tariffs = await this.wbService.fetchTariffs();
      console.log(`Получено ${tariffs.length} тарифов от WB API`);

      // 2. Сохранение в БД
      await this.dbService.saveTariffs(tariffs);

      // 3. Экспорт в Google Sheets
      await this.googleService.exportTariffs(tariffs);

      console.log('Синхронизация тарифов завершена успешно');
    } catch (error) {
      console.error('Ошибка синхронизации тарифов:', error);
      throw error;
    }
  }

  async exportLatestToGoogle(): Promise<void> {
    try {
      const latestTariffs = await this.dbService.getLatestTariffs();
      await this.googleService.exportTariffs(latestTariffs);
      console.log('Последние тарифы экспортированы в Google Sheets');
    } catch (error) {
      console.error('Ошибка экспорта в Google Sheets:', error);
      throw error;
    }
  }
}