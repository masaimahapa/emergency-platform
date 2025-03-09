import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Emergency, EmergencyResponse } from '@/models/emergency.ts';
import { Link } from 'react-router';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ClosestResponders from '@/components/ClosestResponders';
import { Responder, mockResponders } from '@/models/responder';
import { calculateDistance } from '@/lib/utils';

// Fix Leaflet's default icon issue
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create responder icons for different types
const responderIcons = {
  fire: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  medical: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  police: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  rescue: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  default: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Emergency icon
const emergencyIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [35, 57], // Slightly larger to make it stand out
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const EmergencyPage = () => {
    const {id} = useParams();
    const [emergency, setEmergency] = useState<Emergency | null>(null);
    const [responders, setResponders] = useState<Responder[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResponders, setLoadingResponders] = useState(true);

    // Fetch emergency data
    useEffect(() => {
        const fetchEmergency = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/emergency/${id}`);
                const data : EmergencyResponse = await response.json();
                setEmergency(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch emergency:", error);
                setLoading(false);
            }
        };
        fetchEmergency();
    }, [id]);

    // Fetch responders
    useEffect(() => {
        const fetchResponders = async () => {
            try {
                setLoadingResponders(true);
                // TODO: Replace with actual API call when backend is ready
                // const response = await fetch('/api/responders');
                // const data = await response.json();
                
                // Using mock data for now
                setTimeout(() => {
                    setResponders(mockResponders);
                    setLoadingResponders(false);
                }, 500); // Simulate API delay
            } catch (err) {
                console.error("Failed to load responders:", err);
                setLoadingResponders(false);
            }
        };

        fetchResponders();
    }, []);

    if (loading) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <div className='animate-pulse'>Loading emergency details...</div>
            </div>
        );
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

    // Calculate responder distances for the component
    const respondersWithDistance = responders.map(responder => ({
        ...responder,
        distance: calculateDistance(emergency.location, responder.location)
    }));

    // Get icon for responder based on type
    const getResponderIcon = (type: string) => {
        const iconKey = type.toLowerCase() as keyof typeof responderIcons;
        return responderIcons[iconKey] || responderIcons.default;
    };

    return (
        <div className='container mx-auto p-4'>
            <Link to="/emergencies" className='mb-4 inline-block pb-2'>
                ← Back to Emergencies
            </Link>
            
            <h1 className='text-2xl font-bold text-center mb-4'>
                Emergency Details for #{emergency.id}
            </h1>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Emergency details */}
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-bold mb-2'>Emergency Information</h2>
                    <div className='space-y-2'>
                        <div>
                            <p className='font-medium'>Name</p>
                            <p className='text-gray-700'>{emergency.name}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Description</p>
                            <p className='text-gray-700'>{emergency.description}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Coordinates</p>
                            <p className='text-gray-700'>{emergency.location.latitude}, {emergency.location.longitude}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Status</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                emergency.status === 'active' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                                {emergency.status}
                            </span>
                        </div>
                        <div>
                            <p className='font-medium'>Reported</p>
                            <p className='text-gray-700'>{new Date(emergency.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Closest responders section */}
                <ClosestResponders 
                    emergencyLocation={emergency.location} 
                    emergencyType={emergency.name.split(' ')[0]} // Simple extraction of emergency type
                />
            </div>

            {/* Map section - full width */}
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
                
                <div className='w-full h-96' style={{ position: 'relative' }}>
                    <MapContainer 
                        center={[emergency.location.latitude, emergency.location.longitude]} 
                        zoom={13} 
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Emergency location marker */}
                        <Marker 
                            position={[emergency.location.latitude, emergency.location.longitude]} 
                            icon={emergencyIcon}
                        >
                            <Popup>
                                <strong>{emergency.name}</strong><br />
                                {emergency.description}
                            </Popup>
                            <Tooltip permanent>Emergency Site</Tooltip>
                        </Marker>
                        
                        {/* Responder markers */}
                        {!loadingResponders && responders.map(responder => (
                            <Marker 
                                key={responder.id}
                                position={[responder.location.latitude, responder.location.longitude]} 
                                icon={getResponderIcon(responder.type)}
                            >
                                <Popup>
                                    <strong>{responder.name}</strong><br />
                                    Type: {responder.type}<br />
                                    Status: {responder.status}<br />
                                    {respondersWithDistance.find(r => r.id === responder.id)?.distance.toFixed(2)} km from emergency
                                </Popup>
                                <Tooltip>{responder.name}</Tooltip>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
};

export default EmergencyPage;