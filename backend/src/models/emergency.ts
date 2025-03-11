import { emergenciesTable, responderEmergenciesTable, respondersTable } from '../db/schema';
import 'dotenv/config';
import { eq, and } from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/libsql';
import * as schema from '../db/schema';

const db = drizzle(process.env.DB_FILE_NAME!, {schema})


export interface BaseEmergency {
    type: string;
    description: string;
    latitude: number;
    longitude: number;
    status: string;

}

export interface EmergencyInput extends BaseEmergency {}

export interface Emergency extends BaseEmergency {
    id: number;
    createdAt: number;
    updatedAt: number;
}

const EmergencyService = {
    getEmergencies: async (status?: string): Promise<Emergency[]> => {
        if (status) {
            const emergenciesList = await db.select().from(emergenciesTable).where(eq(emergenciesTable.status, status));
            return emergenciesList;
        } else {
            const emergenciesList = await db.select().from(emergenciesTable);
            return emergenciesList;
        }
    },
    getEmergencyById: async (id: string): Promise<Emergency> => {
        const emergency = await db.select().from(emergenciesTable).where(eq(emergenciesTable.id, parseInt(id)))
        return emergency[0];
    },
    createEmergency: async (emergency: EmergencyInput): Promise<Emergency> => {
        if (!emergency.type || emergency.type.trim() === '') {
            throw new Error('Emergency type is required');
        }
        
        if (!emergency.description || emergency.description.trim() === '') {
            throw new Error('Emergency description is required');
        }
        
        if (!emergency.latitude || !emergency.longitude) {
            throw new Error('Valid location coordinates are required');
        }
        

        return {
            id: 1, 
            type: emergency.type,
            description: emergency.description,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            status: 'active',
            createdAt: 1715222400,
            updatedAt: 1715222400
        }
    },
    updateEmergency: async (id: string, emergency: EmergencyInput): Promise<Emergency> => {
        return {
            id: 1,
            type: emergency.type,
            description: emergency.description,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            status: 'resolved',
            createdAt: 1715222400,
            updatedAt: 1715222400
        }
    },
    getEmergencyWithResponders: async (id: string): Promise<Emergency & {responders: schema.Responder[]}> => {

        const emergency = await db.query.emergenciesTable.findFirst({
            where: eq(emergenciesTable.id, parseInt(id)),
            with: {
                responderEmergencies: {
                    with: {
                        responder: true
                    }
                } 
            }
        });

        if (!emergency) {
            throw new Error(`Emergency with ID ${id} not found`);
        }
        
        let transformedEmergency = {
            ...emergency,
            responders: emergency.responderEmergencies
                .filter(re => re.responder)
                .map(re => re.responder!)
        };

        

        return transformedEmergency;
    },
    assignResponderToEmergency: async (emergencyId: string, responderId: string | number): Promise<void> => {
        console.log(`Model: Assigning responder ${responderId} to emergency ${emergencyId}`);
        
        const emergencyIdNum = parseInt(String(emergencyId));
        const responderIdNum = parseInt(String(responderId));
        
        await db.insert(responderEmergenciesTable).values({
            emergencyId: emergencyIdNum,
            responderId: responderIdNum
        });
        
        await db.update(respondersTable)
            .set({ status: 'assigned' })
            .where(eq(respondersTable.id, responderIdNum));
    },
    removeResponderFromEmergency: async (emergencyId: string, responderId: string | number): Promise<void> => {
        console.log(`Model: Removing responder ${responderId} from emergency ${emergencyId}`);
        
        const emergencyIdNum = parseInt(String(emergencyId));
        const responderIdNum = parseInt(String(responderId));
        
        await db.delete(responderEmergenciesTable)
            .where(
                and(
                    eq(responderEmergenciesTable.emergencyId, emergencyIdNum),
                    eq(responderEmergenciesTable.responderId, responderIdNum)
                )
            );
            
        await db.update(respondersTable)
            .set({ status: 'active' })
            .where(eq(respondersTable.id, responderIdNum));
    }
}

export default EmergencyService;