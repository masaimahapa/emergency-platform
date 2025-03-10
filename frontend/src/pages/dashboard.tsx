import React, { useEffect, useState } from 'react'
import {Emergency} from '@/models/emergency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/stat-card';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const createCustomIcon = (type: string, color: string) => {
    let svg;
    switch(type){
        case 'fire':
            svg= `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`
            break;
        case 'medical':
            svg=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`
            break;
        case 'traffic':
            svg=``
            break;
        default:
            svg= `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-siren"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 12v6"/></svg>`
            break;
    }
    const icon = L.divIcon({
        html: svg,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -36]
    });
    return icon;
}
L.Marker.prototype.options.icon = defaultIcon;

function Dashboard(){
    const [activeEmergencies, setActiveEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        activeEmergencies: 0,
        totalResponders: 0,
        availableResponders: 0
    })

    const getMapBounds = (emergencies: Emergency[]) => {
        if(emergencies.length === 0) return [[-26.1074, 28.0543], [-26.1074, 28.0543]];

        const lats= emergencies.map(e => e.latitude);
        const longs = emergencies.map(e => e.longitude);

        const minLat = Math.min(...lats);
        const maxLat= Math.max(...lats);
        const minLong= Math.min(...longs);
        const maxLong= Math.max(...longs);

        return [[minLat, minLong], [maxLat, maxLong]];
    }



    useEffect(() =>{
const fetchData = async () => {
    try{
        setLoading(true);
        const emergenciesResponse = await fetch('/api/emergency?status=active');
        const emergenciesData = await emergenciesResponse.json();

        const respondersResponse = await fetch('/api/responders');
        const respondersData = await respondersResponse.json();

        const availableResponders = respondersData.data.filter((responder: any) => responder.status === 'active');
        debugger;
        
        setActiveEmergencies(emergenciesData.data);
        setStats({
            activeEmergencies: emergenciesData.data.length,
            availableResponders: availableResponders.length,
            totalResponders: respondersData.data.length
        })
        setLoading(false);
    } catch(error){ 
        console.error('Error fetching emergencies:', error);
        setLoading(false);
    }
}
fetchData();
    }, [])
    return (
        <div className='container mx-auto p-4'>
<header className='mb-8'>
<h1 className='text-2xl font-bold'>Dashboard</h1>

</header>

<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
<StatCard title='Active Emergencies' value={stats.activeEmergencies} />
<StatCard title='Total Responders' value={stats.totalResponders} />
<StatCard title='Available Responders' value={stats.availableResponders} />
</div>

<div className='mt-8'>
    <Card>
        <CardHeader>Active Emergencies Map</CardHeader>
        <CardContent className="h-96">
            {activeEmergencies.length >0 && (
                <MapContainer
                bounds={getMapBounds(activeEmergencies)}
                style={{width: '100%', height: '100%'}}
                zoomControl={true}
                
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {activeEmergencies.map(emergency =>(
                        <Marker key={emergency.id} position={[emergency.latitude, emergency.longitude]}
                        icon={createCustomIcon(emergency.type, 'red')}
                        >
                            <Popup>
                                <div>
                                    <h3>{emergency.type}</h3>
                                    <p>{emergency.description}</p>
                                    <Link to={`/emergencies/${emergency.id}`}>View Details</Link>
                                    <div className='my-2'>
                                    <Badge variant='destructive'>{emergency.status}</Badge>
                                    </div>

                                    <div>
                                        Reported at: {new Date(emergency.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </CardContent>
    </Card>
</div>
        </div>
    )
}

export default Dashboard;