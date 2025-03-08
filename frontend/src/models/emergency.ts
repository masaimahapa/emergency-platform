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