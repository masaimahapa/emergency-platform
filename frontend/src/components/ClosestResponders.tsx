import React, { useEffect, useState } from 'react';
import { Responder } from '@/models/responder';
import { calculateDistance } from '@/lib/utils';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
interface ClosestRespondersProps {
  emergencyLocation: {latitude: number, longitude: number};
  emergencyType?: string;
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
        const response = await fetch(`${backendUrl}/api/responders/available`);
        const data = await response.json();
        
        if (data.data) {
          setResponders(data.data);
        } else {
          setError('No responders found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load responders');
        setLoading(false);
      }
    };

    fetchResponders();
  }, []);

  const sortedResponders = responders
    .filter(responder => responder.status === 'active')
    .filter(responder => !emergencyType || responder.type === emergencyType.toLowerCase())
    .map(responder => ({
      ...responder,
      distance: calculateDistance(
        {latitude: emergencyLocation.latitude, longitude: emergencyLocation.longitude},
        {latitude: responder.latitude, longitude: responder.longitude})
    }))
    .sort((a, b) => a.distance - b.distance);
  
  const closestResponders = sortedResponders.slice(0, 3); 

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
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosestResponders; 