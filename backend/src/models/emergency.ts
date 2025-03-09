import { getEmergencies } from '@/controllers/emergencyController';
import { emergenciesTable, responderEmergenciesTable, respondersTable } from '../db/schema';
import 'dotenv/config';
import { eq, and } from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/libsql';
// import {emergenciesTable} from '../db/schema';
import * as schema from '../db/schema';

const db = drizzle(process.env.DB_FILE_NAME!, {schema})

// interface Location {
//     latitude: number;
//     longitude: number;
// }

// enum EmergencyStatus {
//     ACTIVE = "active",
//     RESOLVED = "resolved"
// }

export interface BaseEmergency {
    name: string;
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
    getEmergencies: async (): Promise<Emergency[]> => {
        const emergenciesList = await db.select().from(emergenciesTable);
        return emergenciesList;
        // return [
        //     {
        //         id: 1,
        //         name: "Fire",
        //         description: "A fire has started at Carlton Center in Joburg CBD.",
        //         location: {
        //             latitude: -26.1074,
        //             longitude: 28.0543
        //         },
        //         status: EmergencyStatus.ACTIVE,
        //         createdAt: "2025-03-09",
        //         updatedAt: "2025-03-09"
        //     },
        //     {
        //         id: 2,
        //         name: "House Break-in",
        //         description: "A house break-in has occurred at 123 Main St, Johannesburg.",
        //         location: {
        //             latitude: -26.1074,
        //             longitude: 28.0543
        //         },
        //         status: EmergencyStatus.ACTIVE,
        //         createdAt: "2025-03-09",
        //         updatedAt: "2025-03-09"
        //     },
        //     {
        //         id: 3,
        //         name: "Car Accident",
        //         description: "A car accident has occurred on the N1 highway near Sandton.",
        //         location: {
        //             latitude: -26.1074,
        //             longitude: 28.0543
        //         },
        //         status: EmergencyStatus.ACTIVE,
        //         createdAt: "2025-03-09",
        //         updatedAt: "2025-03-09"
        //     }
        // ]
    },
    getEmergencyById: async (id: string): Promise<Emergency> => {
        const emergency = await db.select().from(emergenciesTable).where(eq(emergenciesTable.id, parseInt(id)))
        return emergency[0];
        // return {
        //     id: 1,
        //     name: "Fire by ID",
        //     description: "A fire has started at Carlton Center in Joburg CBD.",
    
        //         latitude: -26.1074,
        //         longitude: 28.0543,
   
        //     status: 'active',
        //     createdAt: 1715222400,
        //     updatedAt: 1715222400
        // }
    },
    createEmergency: async (emergency: EmergencyInput): Promise<Emergency> => {
        if (!emergency.name || emergency.name.trim() === '') {
            throw new Error('Emergency name is required');
        }
        
        if (!emergency.description || emergency.description.trim() === '') {
            throw new Error('Emergency description is required');
        }
        
        if (!emergency.latitude || !emergency.longitude) {
            throw new Error('Valid location coordinates are required');
        }
        

        return {
            id: 1, 
            name: emergency.name,
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
            name: emergency.name,
            description: emergency.description,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            status: 'resolved',
            createdAt: 1715222400,
            updatedAt: 1715222400
        }
    },
    getEmergencyWithResponders: async (id: string): Promise<Emergency & {responders: schema.Responder[]}> => {

        // Get the emergency first
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
        
        // Transform the responderEmergencies to just responders array
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
        
        // Convert IDs to integers for database operations
        const emergencyIdNum = parseInt(String(emergencyId));
        const responderIdNum = parseInt(String(responderId));
        
        // Create the relationship
        await db.insert(responderEmergenciesTable).values({
            emergencyId: emergencyIdNum,
            responderId: responderIdNum
        });
        
        // Update responder status to 'assigned'
        await db.update(respondersTable)
            .set({ status: 'assigned' })
            .where(eq(respondersTable.id, responderIdNum));
    },
    removeResponderFromEmergency: async (emergencyId: string, responderId: string | number): Promise<void> => {
        console.log(`Model: Removing responder ${responderId} from emergency ${emergencyId}`);
        
        // Convert IDs to integers for database operations
        const emergencyIdNum = parseInt(String(emergencyId));
        const responderIdNum = parseInt(String(responderId));
        
        // Remove the relationship
        await db.delete(responderEmergenciesTable)
            .where(
                and(
                    eq(responderEmergenciesTable.emergencyId, emergencyIdNum),
                    eq(responderEmergenciesTable.responderId, responderIdNum)
                )
            );
            
        // Update responder status back to 'active'
        await db.update(respondersTable)
            .set({ status: 'active' })
            .where(eq(respondersTable.id, responderIdNum));
    }
}

export default EmergencyService;