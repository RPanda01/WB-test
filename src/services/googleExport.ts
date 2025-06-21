import { google } from 'googleapis';
import env from '#config/env/env.js';
import { WBTariff } from '#types/tariffs.js';

export class GoogleSheetsService {
  private sheets;
  private readonly spreadsheetId: string;

  constructor() {
    this.spreadsheetId = env.GOOGLE_SPREADSHEET_ID || '';
    
    if (!this.spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID не найден в переменных окружения');
    }

    // Настройка аутентификации через сервисный аккаунт
    const auth = new google.auth.GoogleAuth({
      keyFile: env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async exportTariffs(tariffs: WBTariff[]): Promise<void> {
    try {
      // Подготовка данных для Google Sheets
      const headers = ['Склад', 'Тип коробки', 'Цена', 'Дата'];
      const values = [
        headers,
        ...tariffs.map(tariff => [
          tariff.warehouse_name,
          tariff.box_type,
          tariff.price,
          tariff.date
        ])
      ];

      // Очистка листа
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'Тарифы!A:D'
      });

      // Запись новых данных
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Тарифы!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      });

      console.log(`Экспортировано ${tariffs.length} тарифов в Google Sheets`);
    } catch (error) {
      console.error('Ошибка экспорта в Google Sheets:', error);
      throw error;
    }
  }

  async createTariffsSheet(): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'Тарифы'
              }
            }
          }]
        }
      });
    } catch (error) {
      // Лист уже существует
      console.log('Лист "Тарифы" уже существует');
    }
  }
}