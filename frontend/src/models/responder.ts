// export interface Location {
//   latitude: number;
//   longitude: number;
// }

export interface Responder {
  id: number;
  name: string;
  type: string; // e.g., "fire", "medical", "police"
  latitude: number;
  longitude: number;
  status: string;
  phoneNumber?: string;
  createdAt?: number;
  updatedAt?: number;
}

// export enum ResponderStatus {
//   AVAILABLE = "available",
//   BUSY = "busy",
//   OFFLINE = "offline"
// }

export interface ResponderResponse {
  message?: string;
  data: Responder | Responder[];
} 