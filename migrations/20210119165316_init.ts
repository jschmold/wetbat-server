/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Knex from 'knex';

import destinations from './destinations.json';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE EXTENSION IF NOT EXISTS citext;` +
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` +
      `CREATE SCHEMA app;`,
  );

  // Allow the app to expand its destinations via a future admin panel
  await knex.schema
    .withSchema('app')
    .createTable('destinations', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

      tbl.string('name', 256);
      tbl.string('airport_code', 3).notNullable();
      tbl.string('country', 256).notNullable();

      tbl.timestamp('created_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.timestamp('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable();
    });

  // Allows the user to populate _more_ of the potential destinations in the dropdown.
  // The text for these will get copied into the text field for quotes
  await knex.schema
    .withSchema('app')
    .createTable('travel_methods', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      tbl.text('name', 'varchar(256)');

      tbl.timestamp('created_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.timestamp('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable();
    });

  // The bulk of the data will rest here. As such, a text-search index will be necessary later,
  // but I'm not doing it here since this is MVP and I don't want to focus on performance
  // optimizations for a problem that does not exist (yet)
  await knex.schema
    .withSchema('app')
    .createTable('quotes', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

      tbl.timestamp('created_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.timestamp('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.string('name', 256).notNullable();

      tbl.uuid('destination_id')
        .references('id')
        .inTable('app.destinations')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');

      tbl.dateTime('departure_date')
        .notNullable();

      tbl.dateTime('return_date')
        .notNullable();

      tbl.integer('travellers')
        .notNullable()
        .defaultTo(1);

      tbl.string('travel_method', 256);
    });

  const destinationData = destinations.codes.map(([ name, country, airport_code ]) => ({
    name: name.trim(),
    country: country.trim(),
    airport_code: airport_code.trim(),
  }));

  await knex.table('app.destinations').insert(destinationData);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('app')
    .dropTable('quotes');

  await knex.schema
    .withSchema('app')
    .dropTable('travel_methods');

  await knex.schema
    .withSchema('app')
    .dropTable('destinations');

  await knex.schema.dropSchema('app');
}
