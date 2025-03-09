import React, { useEffect, useState } from 'react';
import { Responder, mockResponders, ResponderStatus } from '@/models/responder';
import { calculateDistance } from '@/lib/utils';
import { Location } from '@/models/responder';

interface ClosestRespondersProps {
  emergencyLocation: Location;
  emergencyType?: string; // Optional, for filtering responders by type
}

const ClosestResponders: React.FC<ClosestRespondersProps> = ({ 
  emergencyLocation,
  emergencyType
}) => {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponders = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch('/api/responders');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setResponders(mockResponders);
          setLoading(false);
        }, 500); // Simulate API delay
      } catch (err) {
        setError('Failed to load responders');
        setLoading(false);
      }
    };

    fetchResponders();
  }, []);

  // Calculate distances and sort responders
  const sortedResponders = responders
    .filter(responder => responder.status === ResponderStatus.AVAILABLE)
    .filter(responder => !emergencyType || responder.type === emergencyType.toLowerCase())
    .map(responder => ({
      ...responder,
      distance: calculateDistance(emergencyLocation, responder.location)
    }))
    .sort((a, b) => a.distance - b.distance);
  
  const closestResponders = sortedResponders.slice(0, 3); // Get top 3 closest

  if (loading) return <div className="p-4 text-center">Loading responders...</div>;
  
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  if (closestResponders.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
        <h3 className="text-lg font-medium text-yellow-700">No available responders found</h3>
        <p className="text-yellow-600">There are currently no responders available for this emergency.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Closest Available Responders</h2>
      <div className="space-y-3">
        {closestResponders.map(responder => (
          <div 
            key={responder.id} 
            className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{responder.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{responder.type}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{responder.distance.toFixed(2)} km</span> away
                </p>
              </div>
              <div className="bg-green-100 px-2 py-1 rounded-full text-xs text-green-800">
                Available
              </div>
            </div>
            
            {responder.phoneNumber && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <a 
                  href={`tel:${responder.phoneNumber}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {responder.phoneNumber}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosestResponders; 