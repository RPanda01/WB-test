import cron from 'node-cron';
import { TariffsSyncService } from '../services/tariffsSync.js';

export class TariffsScheduler {
  private syncService: TariffsSyncService;

  constructor() {
    this.syncService = new TariffsSyncService();
  }

  start(): void {
    // Запуск каждый день в 9:00
    cron.schedule('0 9 * * *', async () => {
      console.log('Запуск ежедневной синхронизации тарифов...');
      try {
        await this.syncService.syncTariffs();
      } catch (error) {
        console.error('Ошибка в планировщике тарифов:', error);
      }
    });

    console.log('Планировщик тарифов запущен (каждый день в 9:00)');
  }

  async runOnce(): Promise<void> {
    await this.syncService.syncTariffs();
  }
}