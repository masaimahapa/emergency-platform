import { respondersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import 'dotenv/config';

const db = drizzle(process.env.DB_FILE_NAME!);

export enum ResponderStatus {
    ACTIVE = 'active',
    ASSIGNED = 'assigned',
    OFFLINE = 'offline',
}

export interface BaseResponder {
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    status: string;
}

const isValidResponderStatus = (status: string): boolean => {
    return Object.values(ResponderStatus).includes(status as ResponderStatus);
}

export interface ResponderInput extends BaseResponder {}

export interface Responder extends BaseResponder {
    id: number;
    createdAt: number;
    updatedAt: number;
}

const ResponderService = {
    getResponders: async (status: string): Promise<Responder[]> => {
        if (status) {
            if (!isValidResponderStatus(status)) {
                throw new Error(`Invalid status: ${status}`);
            }
            const responders = await db.select().from(respondersTable).where(eq(respondersTable.status, status));
            return responders as Responder[];
        } else {
            const responders = await db.select().from(respondersTable);
            return responders as Responder[];
        }
    },
    
    getResponderById: async (id: string): Promise<Responder> => {
        const responder = await db.select().from(respondersTable).where(eq(respondersTable.id, parseInt(id))).limit(1);
        if (responder.length === 0) {
            throw new Error(`Responder with ID ${id} not found`);
        }
        return responder[0] as Responder;
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
        if (!isValidResponderStatus(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
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