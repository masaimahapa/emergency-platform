import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import L from 'leaflet';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Coordinates {
  latitude: number;
  longitude: number;
}


export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  if (!point1 || !point2 || 
      point1.latitude === undefined || point1.longitude === undefined ||
      point2.latitude === undefined || point2.longitude === undefined) {
    console.warn('Invalid coordinates provided to calculateDistance');
    return Infinity; 
  }
  
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = degreesToRadians(point2.latitude - point1.latitude);
  const dLon = degreesToRadians(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degreesToRadians(point1.latitude)) * Math.cos(degreesToRadians(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI/180);
}

export interface Location{
  latitude: number;
  longitude: number;
}

export const getMapBounds = (locations: Location[]) => {
  if (locations.length === 0) {
    // Create a default bounds for Johannesburg
    return L.latLngBounds(
      L.latLng(-26.1074, 28.0543),
      L.latLng(-26.1074, 28.0543)
    );
  }

  const lats = locations.map(e => e.latitude);
  const longs = locations.map(e => e.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLong = Math.min(...longs);
  const maxLong = Math.max(...longs);

  return L.latLngBounds(
    L.latLng(minLat, minLong),
    L.latLng(maxLat, maxLong)
  );
}

export const responderIcons = {
  fire: (color: string = '#FF3E00') => L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -36]
  }),
  medical: (color: string = '#0072CE') => L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -36]
  }),
  traffic: (color: string = '#FFC000') => L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-traffic-cone"><path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"/><path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"/><path d="M13.9 3.5a1.93 1.93 0 0 0-3.8 0l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3.1 5 3.1s5-1.4 5-3.1c0-.2 0-.4-.1-.5Z"/><path d="m7 15-1.8 6.6c-.1.5.2 1 .8 1.1h12c.6-.1.9-.6.8-1.1L17 15"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -36]
  }),
  default: (color: string = '#555555') => L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-siren"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 12v6"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -36]
  })
};

export const getResponderIcon = (type: string, color?: string) => {
  const iconKey = type.toLowerCase() as keyof typeof responderIcons;
  const iconCreator = responderIcons[iconKey] || responderIcons.default;
  return iconCreator(color);
};

export const createEmergencyIcon = (type?: string) => {
  if (type && type.toLowerCase() in responderIcons) {
    return getResponderIcon(type, '#FF0000'); 
  }
  
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};