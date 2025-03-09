import 'dotenv/config';
import {drizzle} from 'drizzle-orm/libsql';
import {eq} from 'drizzle-orm';
import {respondersTable, emergenciesTable, responderEmergenciesTable} from './db/schema';

const db = drizzle(process.env.DB_FILE_NAME!);

async function main(){
    const emergency1 : typeof emergenciesTable.$inferInsert = {
        name: 'Fire',
        description: 'Fire in the building.',
        latitude:-26.1044,
        longitude: 28.2543,
        status: 'active',
    }

    const emergency2 : typeof emergenciesTable.$inferInsert = {
        name: 'Medical',
        description: 'Old lady collapsed on the street.',
        latitude:-26.1074,
        longitude: 28.0543,
        status: 'active',
    }

    const emergency3 : typeof emergenciesTable.$inferInsert = {
        name: 'Police',
        description: 'Vehicle accident on the highway.',
        latitude:-26.1084,
        longitude: 28.0933,
        status: 'active',
    }
    await db.insert(emergenciesTable).values(emergency1);
    await db.insert(emergenciesTable).values(emergency2);
    await db.insert(emergenciesTable).values(emergency3);
    console.log('Emergency created successfully');

    const responder : typeof respondersTable.$inferInsert = {
        name: 'ADT Security',
        type: 'security',
        latitude:-27.1074,
        longitude: 28.0543,
        status: 'active',
    }

    const responder2 : typeof respondersTable.$inferInsert = {
        name: 'SAPS',
        type: 'police',
        latitude:-26.1074,
        longitude: 28.0543,
        status: 'active',
    }

    const responder3 : typeof respondersTable.$inferInsert = {
        name: 'ER24',
        type: 'ambulance',
        latitude:-26.1074,
        longitude: 28.0543,
        status: 'active',
    }

    await db.insert(respondersTable).values(responder);
    await db.insert(respondersTable).values(responder2);
    await db.insert(respondersTable).values(responder3);
    console.log('Responder created successfully');

    const emergencies = await db.select().from(emergenciesTable);
    const responders = await db.select().from(respondersTable);

    await db.insert(responderEmergenciesTable).values([
        { emergencyId: emergencies[0].id, responderId: responders[1].id }, // Fire Department to Fire emergency
        { emergencyId: emergencies[1].id, responderId: responders[2].id }, // Ambulance to Medical emergency
        { emergencyId: emergencies[2].id, responderId: responders[0].id }, // ADT Security to Police emergency
        { emergencyId: emergencies[0].id, responderId: responders[0].id }, // ADT Security also to Fire emergency
    ])
    console.log('ResponderEmergencies created successfully');
}

main().catch(console.error);