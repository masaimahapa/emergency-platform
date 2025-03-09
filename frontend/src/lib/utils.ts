import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Coordinates {
  latitude: number;
  longitude: number;
}


export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  // Validate that both points have valid coordinates
  if (!point1 || !point2 || 
      point1.latitude === undefined || point1.longitude === undefined ||
      point2.latitude === undefined || point2.longitude === undefined) {
    console.warn('Invalid coordinates provided to calculateDistance');
    return Infinity; // Return a large value so invalid entries sort to the end
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
