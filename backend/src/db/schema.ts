import { sql } from 'drizzle-orm';
import {int, sqliteTable, text, real} from 'drizzle-orm/sqlite-core';

export const respondersTable = sqliteTable('responders', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
    type: text().notNull(),
    latitude: real().notNull(),
    longitude: real().notNull(),
    status: text().notNull(),
    createdAt: int().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: int().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const emergenciesTable = sqliteTable('emergencies', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
    description: text().notNull(),
    latitude: real().notNull(),
    longitude: real().notNull(),
    status: text().notNull(),
    createdAt: int().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: int().default(sql`CURRENT_TIMESTAMP`).notNull(),
});