import { respondersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import 'dotenv/config';

const db = drizzle(process.env.DB_FILE_NAME!);

export interface BaseResponder {
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    status: string;
}

export interface ResponderInput extends BaseResponder {}

export interface Responder extends BaseResponder {
    id: number;
    createdAt: number;
    updatedAt: number;
}

const ResponderService = {
    getResponders: async (): Promise<Responder[]> => {
        const responders = await db.select().from(respondersTable);
        return responders as Responder[];
    },
    
    getResponderById: async (id: string): Promise<Responder> => {
        const responder = await db.select().from(respondersTable).where(eq(respondersTable.id, parseInt(id))).limit(1);
        if (responder.length === 0) {
            throw new Error(`Responder with ID ${id} not found`);
        }
        return responder[0] as Responder;
    },
    
    getAvailableResponders: async (): Promise<Responder[]> => {
        const responders = await db.select()
            .from(respondersTable)
            .where(eq(respondersTable.status, 'active'));
        
        // Map to ensure the format matches what the frontend expects
        return responders.map(responder => ({
            id: responder.id,
            name: responder.name,
            type: responder.type,
            latitude: responder.latitude,
            longitude: responder.longitude,
            status: responder.status,
            createdAt: responder.createdAt || Date.now(),
            updatedAt: responder.updatedAt || Date.now()
        }));
    },
    
    createResponder: async (responder: ResponderInput): Promise<Responder> => {
        await db.insert(respondersTable).values(responder);
        const inserted = await db.select().from(respondersTable).orderBy(respondersTable.id).limit(1);
        return inserted[0] as Responder;
    },
    
    updateResponder: async (id: string, responder: ResponderInput): Promise<Responder> => {
        await db.update(respondersTable)
            .set(responder)
            .where(eq(respondersTable.id, parseInt(id)));
        
        const updated = await db.select()
            .from(respondersTable)
            .where(eq(respondersTable.id, parseInt(id)))
            .limit(1);
        
        if (updated.length === 0) {
            throw new Error(`Responder with ID ${id} not found`);
        }
        
        return updated[0] as Responder;
    },
    
    updateResponderStatus: async (id: string, status: string): Promise<Responder> => {
        await db.update(respondersTable)
            .set({ status })
            .where(eq(respondersTable.id, parseInt(id)));
        
        const updated = await db.select()
            .from(respondersTable)
            .where(eq(respondersTable.id, parseInt(id)))
            .limit(1);
        
        if (updated.length === 0) {
            throw new Error(`Responder with ID ${id} not found`);
        }
        
        return updated[0] as Responder;
    }
};

export default ResponderService; 