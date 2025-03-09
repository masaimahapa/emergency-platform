import 'dotenv/config';
import {drizzle} from 'drizzle-orm/libsql';
import {eq} from 'drizzle-orm';
import {respondersTable, emergenciesTable} from './db/schema';

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

    await db.insert(respondersTable).values(responder);

    console.log('Responder created successfully');
}

main().catch(console.error);