import Emergency from "../models/emergency";

const emergencyService = {
    getEmergencies: async () => {
        try {
            const result = await Emergency.getEmergencies();
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default emergencyService;