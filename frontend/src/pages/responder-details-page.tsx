import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Responder, ResponderResponse } from "@/models/responder";
import Loader from "@/components/loader";
import MapPlots, { MapMarker } from "@/components/map-plots";
import 'leaflet/dist/leaflet.css';
import { getMapBounds, getResponderIcon } from "@/lib/utils";


const backendUrl = import.meta.env.VITE_BACKEND_URL;




function ResponderDetailsPage() {
    const { id } = useParams();
    const [responder, setResponder] = useState<Responder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        const fetchResponder = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/responders/${id}`);
                const data: ResponderResponse = await response.json();
                const responderData = data.data as Responder;
                setResponder(responderData);
                
                setMapMarkers([{
                    id: responderData.id,
                    latitude: responderData.latitude,
                    longitude: responderData.longitude,
                    icon: getResponderIcon(responderData.type, responderData.status === 'active' ? 'green' : 'gray'),
                    popupContent: (
                        <div>
                            <strong>{responderData.name}</strong><br />
                            Type: {responderData.type}<br />
                            Status: <span className={`font-medium ${
                                responderData.status === 'active' 
                                    ? 'text-green-600'
                                    : responderData.status === 'assigned'
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                            }`}>
                                {responderData.status}
                            </span>
                        </div>
                    )
                }]);
                
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch responder details');
                setLoading(false);
            }
        };
        fetchResponder();
    }, [id]);

    const updateResponderStatus = async (newStatus: 'active' | 'assigned' | 'offline') => {
        try {
            const response = await fetch(`${backendUrl}/api/responders/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const data: ResponderResponse = await response.json();
                setResponder(data.data as Responder);
            } else {
                setError('Failed to update responder status');
            }
        } catch (error) {
            setError('Failed to update responder status');
        }
    };


    if (loading) {
        return <Loader />;
    }

    if (error || !responder) {
        return (
            <div className='container mx-auto p-4'>
                <div className='bg-red-100 text-red-700 p-4 rounded-md'>
                    {error || 'Could not load responder details. Please try again later.'}
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <Link to="/responders" className='mb-4 inline-block pb-2'>
                ← Back to Responders
            </Link>

            <h1 className='text-2xl font-bold text-center mb-4'>
                Responder Details for {responder.name}
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-bold mb-2'>Responder Information</h2>
                    <div className='space-y-2'>
                        <div>
                            <p className='font-medium'>Name</p>
                            <p className='text-gray-700'>{responder.name}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Type</p>
                            <p className='text-gray-700 capitalize'>{responder.type}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Status</p>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                    responder.status === 'active' 
                                        ? 'bg-green-100 text-green-800'
                                        : responder.status === 'assigned'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {responder.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className='font-medium'>Location</p>
                            <p className='text-gray-700'>{responder.latitude}, {responder.longitude}</p>
                        </div>
                        {responder.phoneNumber && (
                            <div>
                                <p className='font-medium'>Phone Number</p>
                                <p className='text-gray-700'>{responder.phoneNumber}</p>
                            </div>
                        )}
                        <div>
                            <p className='font-medium'>Last Updated</p>
                            <p className='text-gray-700'>{new Date(responder.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-bold mb-2'>Status Management</h2>
                    <div className='space-y-4'>
                        <p className='text-gray-600'>Update the responder's current status:</p>
                        <div className='flex flex-wrap gap-2'>
                            <button
                                onClick={() => updateResponderStatus('active')}
                                className={`px-4 py-2 rounded-md ${
                                    responder.status === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                                disabled={responder.status === 'active'}
                            >
                                Set Active
                            </button>
                            <button
                                onClick={() => updateResponderStatus('assigned')}
                                className={`px-4 py-2 rounded-md ${
                                    responder.status === 'assigned'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }`}
                                disabled={responder.status === 'assigned'}
                            >
                                Set Assigned
                            </button>
                            <button
                                onClick={() => updateResponderStatus('offline')}
                                className={`px-4 py-2 rounded-md ${
                                    responder.status === 'offline'
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                disabled={responder.status === 'offline'}
                            >
                                Set Offline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-4'>
                <MapPlots 
                    title="Responder Location" 
                    bounds={getMapBounds([{
                        latitude: responder.latitude,
                        longitude: responder.longitude
                    }])}
                    markers={mapMarkers}
                    center={[responder.latitude, responder.longitude]}
                    zoom={13}
                />
            </div>
        </div>
    );
}

export default ResponderDetailsPage;