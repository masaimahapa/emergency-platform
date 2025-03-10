import Responder, { ResponderInput } from '../models/responder';

const responderService = {
    getResponders: async (status: string) => {
        try {
            const result = await Responder.getResponders(status);
            return result;
        } catch (error) {
            throw error;
        }
    },
    
    getResponderById: async (id: string) => {
        try {
            const result = await Responder.getResponderById(id);
            return result;
        } catch (error) {
            throw error;
        }
    },
    
    
    createResponder: async (responder: ResponderInput) => {
        try {
            const result = await Responder.createResponder(responder);
            return result;
        } catch (error) {
            throw error;
        }
    },
    
    updateResponder: async (id: string, responder: ResponderInput) => {
        try {
            const result = await Responder.updateResponder(id, responder);
            return result;
        } catch (error) {
            throw error;
        }
    },
    
    updateResponderStatus: async (id: string, status: string) => {
        try {
            const result = await Responder.updateResponderStatus(id, status);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

export default responderService; 