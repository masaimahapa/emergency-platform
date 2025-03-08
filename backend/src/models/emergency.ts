interface Location {
    latitude: number;
    longitude: number;
}

enum EmergencyStatus {
    ACTIVE = "active",
    RESOLVED = "resolved"
}

export interface BaseEmergency {
    name: string;
    description: string;
    location: Location;
    status: EmergencyStatus;

}

export interface EmergencyInput extends BaseEmergency {}

export interface Emergency extends BaseEmergency {
    id: number;
    createdAt: string;
    updatedAt: string;
}

const EmergencyService = {
    getEmergencies: async (): Promise<Emergency[]> => {
        return [
            {
                id: 1,
                name: "Fire",
                description: "A fire has started at Carlton Center in Joburg CBD.",
                location: {
                    latitude: -26.1074,
                    longitude: 28.0543
                },
                status: EmergencyStatus.ACTIVE,
                createdAt: "2025-03-09",
                updatedAt: "2025-03-09"
            },
            {
                id: 2,
                name: "House Break-in",
                description: "A house break-in has occurred at 123 Main St, Johannesburg.",
                location: {
                    latitude: -26.1074,
                    longitude: 28.0543
                },
                status: EmergencyStatus.ACTIVE,
                createdAt: "2025-03-09",
                updatedAt: "2025-03-09"
            },
            {
                id: 3,
                name: "Car Accident",
                description: "A car accident has occurred on the N1 highway near Sandton.",
                location: {
                    latitude: -26.1074,
                    longitude: 28.0543
                },
                status: EmergencyStatus.ACTIVE,
                createdAt: "2025-03-09",
                updatedAt: "2025-03-09"
            }
        ]
    },
    getEmergencyById: async (id: string): Promise<Emergency> => {
        return {
            id: 1,
            name: "Fire by ID",
            description: "A fire has started at Carlton Center in Joburg CBD.",
            location: {
                latitude: -26.1074,
                longitude: 28.0543
            },
            status: EmergencyStatus.ACTIVE,
            createdAt: "2025-03-09",
            updatedAt: "2025-03-09"
        }
    },
    createEmergency: async (emergency: EmergencyInput): Promise<Emergency> => {
        if (!emergency.name || emergency.name.trim() === '') {
            throw new Error('Emergency name is required');
        }
        
        if (!emergency.description || emergency.description.trim() === '') {
            throw new Error('Emergency description is required');
        }
        
        if (!emergency.location || !emergency.location.latitude || !emergency.location.longitude) {
            throw new Error('Valid location coordinates are required');
        }
        
        if (!emergency.location.latitude || !emergency.location.longitude) {
            throw new Error('Valid location coordinates are required');
        }

        
        return {
            id: 1, 
            name: emergency.name,
            description: emergency.description,
            location: emergency.location,
            status: EmergencyStatus.ACTIVE,
            createdAt: "2025-03-09",
            updatedAt: "2025-03-09"
        }
    },
    updateEmergency: async (id: string, emergency: EmergencyInput): Promise<Emergency> => {
        return {
            id: 1,
            name: emergency.name,
            description: emergency.description,
            location: emergency.location,
            status: EmergencyStatus.RESOLVED,
            createdAt: "2025-03-09",
            updatedAt: "2025-03-09"
        }
    }
}

export default EmergencyService;