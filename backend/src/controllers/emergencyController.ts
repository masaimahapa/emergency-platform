import {Request, Response} from "express";
import emergencyService from "../services/emergencyService";

export const getEmergencies = async (req: Request, res: Response) => {
    try{
        const result = await emergencyService.getEmergencies();
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