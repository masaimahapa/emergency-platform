import { Responder } from './responder';

// interface Location {
//     latitude: number;
//     longitude: number;
// }

// enum EmergencyStatus {
//     ACTIVE = "active",
//     RESOLVED = "resolved"
// }

export interface BaseEmergency {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    status: string;

}

export interface EmergencyInput extends BaseEmergency {}

export interface Emergency extends BaseEmergency {
    id: number;
    createdAt: number;
    updatedAt: number;
    responders?: Responder[];
}

export interface EmergencyResponse {
    data: Emergency;
    message?: string;
}

export interface EmergenciesResponse {
    data: Emergency[];
    message?: string;
}

export interface ErrorResponse {
    message: string;
}