import knex, { migrate, seed } from "#postgres/knex.js";
import { TariffsScheduler } from '#scheduler/tariffsScheduler.js';

await migrate.latest();
await seed.run();
const tariffsScheduler = new TariffsScheduler();
tariffsScheduler.start();

console.log("Tariffs scheduler started");
console.log("All migrations and seeds have been run");