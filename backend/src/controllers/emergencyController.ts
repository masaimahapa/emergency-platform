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