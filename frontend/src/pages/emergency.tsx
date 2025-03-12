import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Emergency, EmergencyResponse } from '@/models/emergency.ts';
import { Link } from 'react-router';
import 'leaflet/dist/leaflet.css';
import { Responder } from '@/models/responder';
import { calculateDistance, createEmergencyIcon, getResponderIcon, getMapBounds } from '@/lib/utils';
import Loader from '@/components/loader';
import MapPlots, { MapMarker } from '@/components/map-plots';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const EmergencyPage = () => {
    const {id} = useParams();
    const [emergency, setEmergency] = useState<Emergency | null>(null);
    const [assignedResponders, setAssignedResponders] = useState<Responder[]>([]);
    const [availableResponders, setAvailableResponders] = useState<Responder[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAssignedResponders, setLoadingAssignedResponders] = useState(true);
    const [loadingAvailableResponders, setLoadingAvailableResponders] = useState(true);

    const fetchEmergency = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/emergency/${id}/responders`);
            const data : EmergencyResponse = await response.json();
            setEmergency(data.data);
            if (data.data.responders) {
                setAssignedResponders(data.data.responders);
            }
            setLoading(false);
            setLoadingAssignedResponders(false);
        } catch (error) {
            console.error("Failed to fetch emergency:", error);
            setLoading(false);
            setLoadingAssignedResponders(false);
        }
    }, [id]);
    
    const fetchAvailableResponders = useCallback(async () => {
        try {
            setLoadingAvailableResponders(true);
            
            const response = await fetch(`${backendUrl}/api/responders?status=active`);
            const data = await response.json();
            
            if (data.data) {
                const availableIds = new Set(assignedResponders.map(r => r.id));
                const filteredResponders = data.data.filter((r: Responder) => !availableIds.has(r.id));
                setAvailableResponders(filteredResponders);
            }
            
            setLoadingAvailableResponders(false);
        } catch (error) {
            console.error("Failed to fetch available responders:", error);
            setLoadingAvailableResponders(false);
        }
    }, [assignedResponders]);

    useEffect(() => {
        fetchEmergency();
    }, [fetchEmergency]);
    
    useEffect(() => {
        if (!loadingAssignedResponders) {
            fetchAvailableResponders();
        }
    }, [loadingAssignedResponders, fetchAvailableResponders]);
    
    const assignResponder = async (responderId: number) => {
        try {
            const response = await fetch(`${backendUrl}/api/emergency/${id}/responders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ responderId }),
            });
            
            console.log(`Assigning responder ${responderId} to emergency ${id}`);
            
            if (response.ok) {
                const responderToAdd = availableResponders.find(r => r.id === responderId);
                
                if (responderToAdd) {
                    setAssignedResponders(prev => [...prev, responderToAdd]);
                    
                    setAvailableResponders(prev => prev.filter(r => r.id !== responderId));
                } else {
                    fetchEmergency();
                }
            } else {
                console.error("Failed to assign responder");
            }
        } catch (error) {
            console.error("Error assigning responder:", error);
        }
    };
    
    const removeResponder = async (responderId: number) => {
        try {
            const response = await fetch(`${backendUrl}/api/emergency/${id}/responders/${responderId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                const responderToRemove = assignedResponders.find(r => r.id === responderId);
                
                if (responderToRemove) {
                    setAssignedResponders(prev => prev.filter(r => r.id !== responderId));
                    
                    fetchAvailableResponders();
                } else {
                    fetchEmergency();
                }
            } else {
                console.error("Failed to remove responder");
            }
        } catch (error) {
            console.error("Error removing responder:", error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!emergency) {
        return (
            <div className='container mx-auto p-4'>
                <div className='bg-red-100 text-red-700 p-4 rounded-md'>
                    Could not load emergency details. Please try again later.
                </div>
            </div>
        );
    }

    const assignedRespondersWithDistance = assignedResponders.map(responder => ({
        ...responder,
        distance: calculateDistance({latitude: emergency.latitude, longitude: emergency.longitude}, {latitude: responder.latitude, longitude: responder.longitude})
    }));

    const sortedAvailableResponders = availableResponders
        .map(responder => ({
            ...responder,
            distance: calculateDistance(
                {latitude: emergency.latitude, longitude: emergency.longitude},
                {latitude: responder.latitude, longitude: responder.longitude})
        }))
        .sort((a, b) => a.distance - b.distance);
    
    const closestAvailableResponders = sortedAvailableResponders.slice(0, 3);

    const allMarkers: MapMarker[] = [

        {
            id: `emergency-${emergency.id}`,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            icon: createEmergencyIcon(emergency.type),
            popupContent: (
                <div>
                    <strong>{emergency.type}</strong><br />
                    {emergency.description}
                </div>
            )
        },
        ...assignedRespondersWithDistance.map(responder => ({
            id: `assigned-${responder.id}`,
            latitude: responder.latitude,
            longitude: responder.longitude,
            icon: getResponderIcon(responder.type),
            popupContent: (
                <div>
                    <strong>{responder.name}</strong><br />
                    Type: {responder.type}<br />
                    Status: <Badge variant="secondary" className="bg-blue-100 text-blue-800">Assigned</Badge><br />
                    {responder.distance.toFixed(2)} km from emergency
                    <div className="mt-2">
                        <Button
                            onClick={() => removeResponder(Number(responder.id))}
                            variant="destructive"
                            size="sm"
                            className="w-full"
                        >
                            Remove from Emergency
                        </Button>
                    </div>
                </div>
            )
        })),
        ...closestAvailableResponders.map(responder => ({
            id: `available-${responder.id}`,
            latitude: responder.latitude,
            longitude: responder.longitude,
            icon: getResponderIcon(responder.type),
            popupContent: (
                <div>
                    <strong>{responder.name}</strong><br />
                    Type: {responder.type}<br />
                    Status: <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge><br />
                    {responder.distance.toFixed(2)} km from emergency
                    <div className="mt-2">
                        <Button
                            onClick={() => assignResponder(Number(responder.id))}
                            variant="default"
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Assign to Emergency
                        </Button>
                    </div>
                </div>
            )
        }))
    ];
    
    const allLocations = [
        { latitude: emergency.latitude, longitude: emergency.longitude },
        ...assignedResponders.map(r => ({ latitude: r.latitude, longitude: r.longitude })),
        ...closestAvailableResponders.map(r => ({ latitude: r.latitude, longitude: r.longitude }))
    ];
    const mapBounds = getMapBounds(allLocations);
    

    return (
        <div className='container mx-auto p-4'>
            <Link to="/emergencies" className='mb-4 inline-block pb-2'>
                ← Back to Emergencies
            </Link>
            
            <h1 className='text-2xl font-bold text-center mb-4'>
                Emergency Details for #{emergency.id}
            </h1>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-bold mb-2'>Emergency Information</h2>
                    <div className='space-y-2'>
                        <div>
                            <p className='font-medium'>Type</p>
                            <p className='text-gray-700'>{emergency.type}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Description</p>
                            <p className='text-gray-700'>{emergency.description}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Coordinates</p>
                            <p className='text-gray-700'>{emergency.latitude}, {emergency.longitude}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Status</p>
                            <Badge variant={emergency.status === 'active' ? 'destructive' : 'secondary'} 
                                className={emergency.status === 'active' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'}>
                                {emergency.status}
                            </Badge>
                        </div>
                        <div>
                            <p className='font-medium'>Reported</p>
                            <p className='text-gray-700'>{new Date(emergency.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Assigned Responders</h2>
                    
                    {loadingAssignedResponders ? (
                        <div className="text-center p-4">Loading assigned responders...</div>
                    ) : assignedResponders.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                            <p className="text-gray-600">No responders have been assigned to this emergency yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {assignedRespondersWithDistance.map(responder => (
                                <div 
                                    key={responder.id} 
                                    className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">
                                                <Link to={`/responders/${responder.id}`}>
                                                    {responder.name}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-600 capitalize">{responder.type}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                <span className="font-medium">{responder.distance.toFixed(2)} km</span> from emergency
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                Assigned
                                            </Badge>
                                            <Button
                                                onClick={() => removeResponder(Number(responder.id))}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                <h2 className="text-lg font-bold mb-4">Closest Available Responders</h2>
                
                {loadingAvailableResponders ? (
                    <div className="text-center p-4">Loading available responders...</div>
                ) : closestAvailableResponders.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-yellow-700">No available responders found</h3>
                        <p className="text-yellow-600">There are currently no responders available for this emergency.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {closestAvailableResponders.map(responder => (
                            <div 
                                key={responder.id} 
                                className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">
                                            <Link to={`/responders/${responder.id}`}>
                                                {responder.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-gray-600 capitalize">{responder.type}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">{responder.distance.toFixed(2)} km</span> away
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => assignResponder(Number(responder.id))}
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='bg-white shadow-md rounded-lg p-4 mt-4'>
                <h2 className='text-lg font-bold mb-2'>Response Map</h2>
                
                <div className='mb-3 flex flex-wrap gap-3'>
                    <div className='text-sm font-medium'>Map Legend:</div>
                    <div className='text-sm flex items-center'>
                        <span className='inline-block w-3 h-3 mr-1 bg-black rounded-full'></span> Emergency
                    </div>
                    <div className='text-sm flex items-center'>
                        <span className='inline-block w-3 h-3 mr-1 bg-red-500 rounded-full'></span> Fire
                    </div>
                    <div className='text-sm flex items-center'>
                        <span className='inline-block w-3 h-3 mr-1 bg-green-500 rounded-full'></span> Medical
                    </div>
                    <div className='text-sm flex items-center'>
                        <span className='inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full'></span> Police
                    </div>
                    <div className='text-sm flex items-center'>
                        <span className='inline-block w-3 h-3 mr-1 bg-orange-500 rounded-full'></span> Rescue
                    </div>
                </div>
                
                <div className="rounded-md overflow-hidden border border-gray-200">
                    <MapPlots
                        markers={allMarkers}
                        title="Emergency Response Map"
                        zoom={12}
                        bounds={mapBounds}
                        center={[emergency.latitude, emergency.longitude]}
                        className="h-[600px]"
                    />
                </div>
            </div>
        </div>
    )
};

export default EmergencyPage;