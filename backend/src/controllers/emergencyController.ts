import {Request, Response} from "express";
import emergencyService from "../services/emergencyService";

export const getEmergencies = async (req: Request, res: Response) => {
    try{
        const {status} = req.query;
        const result = await emergencyService.getEmergencies(status as string);
        console.log(result);
        res.status(200).json({
            message: "Emergencies fetched successfully",
            data: result
        })
    } catch (error){
        res.status(500).json({
            message: "Error fetching emergencies"
        })
    }
}

export const getEmergencyById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const emergency = await emergencyService.getEmergencyById(id);
        res.status(200).json({
            message: "Emergency fetched successfully",
            data: emergency
        })
    } catch (error){
        res.status(500).json({
            message: "Error fetching emergency"
        })
    }
}

export const createEmergency = async (req: Request, res: Response) => {
    try {
        const emergency = req.body;
        const result = await emergencyService.createEmergency(emergency);
        res.status(201).json({
            message: "Emergency created successfully",
            data: result
        })
    } catch (error){
        res.status(500).json({
            message: "Error creating emergency" 
        })
    }
}

export const updateEmergency = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const emergency = req.body;
        const result = await emergencyService.updateEmergency(id, emergency);
        res.status(200).json({
            message: "Emergency updated successfully",
            data: result
        })
    } catch (error){
        res.status(500).json({
            message: "Error updating emergency"
        })
    }
}

export const assignResponderToEmergency = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  // Get emergency ID from URL
        const { responderId } = req.body;  // Get responder ID from body
        
        console.log(`Assigning responder ${responderId} to emergency ${id}`);
        
        const result = await emergencyService.assignResponderToEmergency(id, responderId);
        res.status(200).json({
            message: "Responder assigned to emergency successfully",
            data: result
        })
    } catch (error){
        console.error("Error assigning responder:", error);
        res.status(500).json({
            message: "Error assigning responder to emergency"
        })
    }
}

export const getEmergencyWithResponders = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const emergency = await emergencyService.getEmergencyWithResponders(id);
        res.status(200).json({
            message: "Emergency with responders fetched successfully",
            data: emergency
        })
    } catch (error){
        res.status(500).json({
            message: "Error fetching emergency with responders"
        })
    }
}

export const removeResponderFromEmergency = async (req: Request, res: Response) => {
    try {
        const { id, responderId } = req.params;
        console.log(`Removing responder ${responderId} from emergency ${id}`);
        const result = await emergencyService.removeResponderFromEmergency(id, responderId);
        res.status(200).json({
            message: "Responder removed from emergency successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing responder from emergency"
        });
    }
}