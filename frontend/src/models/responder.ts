// export interface Location {
//   latitude: number;
//   longitude: number;
// }

export interface Responder {
  id: number;
  name: string;
  type: string; // e.g., "fire", "medical", "police"
  status: 'active' | 'assigned' | 'offline';
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  createdAt?: number;
  updatedAt: string;
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