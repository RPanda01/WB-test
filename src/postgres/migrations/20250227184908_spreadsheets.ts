import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.string('warehouse_name').notNullable();
    table.string('box_type').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.date('date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Индексы для быстрого поиска
    table.index(['date']);
    table.index(['warehouse_name']);
    table.unique(['warehouse_name', 'box_type', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tariffs');
}
