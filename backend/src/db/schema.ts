import { sql, relations } from 'drizzle-orm';
import {int, sqliteTable, text, real, primaryKey} from 'drizzle-orm/sqlite-core';

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

export const responderRelations = relations(respondersTable, ({many}) => ({
    responderEmergencies: many(responderEmergenciesTable)
}))

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

export const emergenciesRelations = relations(emergenciesTable, ({many}) => ({
    responderEmergencies: many(responderEmergenciesTable)
}))

export const responderEmergenciesTable = sqliteTable('responderEmergencies', {
    responderId: int().references(() => respondersTable.id),
    emergencyId: int().references(() => emergenciesTable.id),
}, (t) => [
    primaryKey({
        columns: [t.emergencyId, t.responderId]
    })
])

export const responderEmergenciesRelations = relations(responderEmergenciesTable, ({one}) =>({
    responder: one(respondersTable, {
        fields: [responderEmergenciesTable.responderId],
        references: [respondersTable.id]
    }),
    emergency: one(emergenciesTable, {
        fields: [responderEmergenciesTable.emergencyId],
        references: [emergenciesTable.id]
    })
}))

export type Responder = typeof respondersTable.$inferSelect;
export type NewResponder = typeof respondersTable.$inferInsert;

export type Emergency = typeof emergenciesTable.$inferSelect;
export type NewEmergency = typeof emergenciesTable.$inferInsert;

export type ResponderEmergencies = typeof responderEmergenciesTable.$inferSelect;
export type NewResponderEmergencies = typeof responderEmergenciesTable.$inferInsert;

