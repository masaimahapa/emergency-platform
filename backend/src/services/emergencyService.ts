import Emergency, { EmergencyInput } from "../models/emergency";

const emergencyService = {
    getEmergencies: async () => {
        try {
            const result = await Emergency.getEmergencies();
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
    }
}

export default emergencyService;