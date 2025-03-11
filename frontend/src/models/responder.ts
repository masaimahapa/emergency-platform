
export interface Responder {
  id: number;
  name: string;
  type: string; 
  status: 'active' | 'assigned' | 'offline';
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  createdAt?: number;
  updatedAt: string;
}


export interface ResponderResponse {
  message?: string;
  data: Responder | Responder[];
} 