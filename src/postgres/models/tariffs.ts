import knex from '#postgres/knex.js';
import { TariffRecord } from '#types/tariffs.js';

export class TariffModel {
  static async create(tariff: Omit<TariffRecord, 'id' | 'created_at' | 'updated_at'>): Promise<TariffRecord> {
    const [result] = await knex('tariffs')
      .insert(tariff)
      .returning('*');
    return result;
  }

  static async bulkInsert(tariffs: Omit<TariffRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> {
    if (tariffs.length === 0) return;
    
    await knex('tariffs')
      .insert(tariffs)
      .onConflict(['warehouse_name', 'box_type', 'date'])
      .merge(['price', 'updated_at']);
  }

  static async getByDate(date: string): Promise<TariffRecord[]> {
    return knex('tariffs')
      .where('date', date)
      .orderBy('warehouse_name', 'box_type');
  }

  static async getLatest(): Promise<TariffRecord[]> {
    return knex('tariffs')
      .whereIn('date', function() {
        this.select(knex.raw('MAX(date)')).from('tariffs');
      })
      .orderBy('warehouse_name', 'box_type');
  }
}