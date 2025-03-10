import Emergency, { EmergencyInput } from "../models/emergency";

const emergencyService = {
    getEmergencies: async (status?: string) => {
        try {
            const result = await Emergency.getEmergencies(status);
            return result;
        } catch (error) {
            throw error;
        }
    },
    getEmergencyById: async (id: string) => {
        try {
            const result = await Emergency.getEmergencyById(id);
            return result;
        } catch (error) {
            throw error;
        }
    },
    createEmergency: async (emergency: EmergencyInput) => {
        try {
            const result = await Emergency.createEmergency(emergency);
            return result;
        } catch (error) {
            throw error;
        }
    },
    updateEmergency: async (id: string, emergency: EmergencyInput) => {
        try {
            const result = await Emergency.updateEmergency(id, emergency);
            return result;
        } catch (error) {
            throw error;
        }
    },
    assignResponderToEmergency: async (emergencyId: string, responderId: string) => {
        try {
            const result = await Emergency.assignResponderToEmergency(emergencyId, responderId);
            return result;
        } catch (error) {
            throw error;
        }
    }, 
    getEmergencyWithResponders: async (id: string) => {
        try {
            const result = await Emergency.getEmergencyWithResponders(id);
            return result;
        } catch (error) {
            throw error;
        }
    },
    removeResponderFromEmergency: async (emergencyId: string, responderId: string) => {
        try {
            const result = await Emergency.removeResponderFromEmergency(emergencyId, responderId);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default emergencyService;