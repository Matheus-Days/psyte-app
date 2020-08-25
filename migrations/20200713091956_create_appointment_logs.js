exports.up = function (knex, Promise) {
  return knex.schema.createTable("appointments", (table) => {
    table.increments("id").primary();
    table.string("sessionStart").notNull();
    table.string("sessionEnd").notNull();
    table.string("eventId").notNull();
    table
      .integer("userId")
      .references("id")
      .inTable("users")
      .unsigned()
      .notNull();
    table
      .integer("psychoId")
      .references("id")
      .inTable("users")
      .unsigned()
      .notNull();
    table.timestamp("createdAt");
    table.timestamp("deletedAt");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("appointments");
};
