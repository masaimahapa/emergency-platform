// export interface Location {
//   latitude: number;
//   longitude: number;
// }

export interface Responder {
  id: string;
  name: string;
  type: string; // e.g., "fire", "medical", "police"
  latitude: number;
  longitude: number;
  status: string;
  phoneNumber?: string;
}

// export enum ResponderStatus {
//   AVAILABLE = "available",
//   BUSY = "busy",
//   OFFLINE = "offline"
// }

export interface ResponderResponse {
  success: boolean;
  data: Responder | Responder[];
}

// Mock data for testing until backend is ready
export const mockResponders: Responder[] = [
  {
    id: "resp_1",
    name: "Fire Engine 42",
    type: "fire",
    latitude: -26.1054,
    longitude: 28.0560,
    status: 'available'
  },
  {
    id: "resp_2",
    name: "Ambulance 15",
    type: "medical",
    latitude: -26.1095,
    longitude: 28.0543,
    status: 'available'
  },
  {
    id: "resp_3",
    name: "Police Unit 8",
    type: "police",
    latitude: -26.1030,
    longitude: 28.0600,
    status: 'available'
  },
  {
    id: "resp_4",
    name: "Emergency Response Team Alpha",
    type: "rescue",
    latitude: -26.1080,
    longitude: 28.0570,
    status: 'available'
  }
]; 