import { Request, Response } from 'express';
import responderService from '../services/responderService';

export const getResponders = async (req: Request, res: Response) => {
    const {status} = req.query;
    try {
        const responders = await responderService.getResponders(status as string);
        res.status(200).json({
            message: "Responders fetched successfully",
            data: responders
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching responders"
        });
    }
};

export const getResponderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const responder = await responderService.getResponderById(id);
        res.status(200).json({
            message: "Responder fetched successfully",
            data: responder
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching responder"
        });
    }
};


export const createResponder = async (req: Request, res: Response) => {
    try {
        const responder = req.body;
        const result = await responderService.createResponder(responder);
        res.status(201).json({
            message: "Responder created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating responder"
        });
    }
};

export const updateResponder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const responder = req.body;
        const result = await responderService.updateResponder(id, responder);
        res.status(200).json({
            message: "Responder updated successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating responder"
        });
    }
};

export const updateResponderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await responderService.updateResponderStatus(id, status);
        res.status(200).json({
            message: "Responder status updated successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating responder status"
        });
    }
}; 