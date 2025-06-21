/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "16Dutd5x6r-VTUcptzC99WNeRbyc868s0qCXdKVWuINU" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
