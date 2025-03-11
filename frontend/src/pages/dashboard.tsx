import { useEffect, useState } from 'react'
import {Emergency} from '@/models/emergency';
import StatCard from '@/components/stat-card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/loader';
import MapPlots from '@/components/map-plots';
import { MapMarker } from '@/components/map-plots';
import { createEmergencyIcon, getMapBounds } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})


L.Marker.prototype.options.icon = defaultIcon;

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function Dashboard(){
    const [activeEmergencies, setActiveEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        activeEmergencies: 0,
        totalResponders: 0,
        availableResponders: 0
    })

    const [emergencyMarkers, setEmergencyMarkers] = useState<MapMarker[]>([]);


    useEffect(() =>{
const fetchData = async () => {
    try{
        setLoading(true);
        const emergenciesResponse = await fetch(`${backendUrl}/api/emergency?status=active`);
        const emergenciesData = await emergenciesResponse.json();

        const respondersResponse = await fetch(`${backendUrl}/api/responders`);
        const respondersData = await respondersResponse.json();

        const availableResponders = respondersData.data.filter((responder: any) => responder.status === 'active');

        
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

    useEffect(() => {
        const markers = activeEmergencies.map(emergency => ({
            id: emergency.id,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            icon: createEmergencyIcon(emergency.type),
            popupContent: (
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
            )
        }));
        setEmergencyMarkers(markers);
    }, [activeEmergencies]);
    
    if (loading) {
        return <Loader />;
    }
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
{emergencyMarkers.length > 0 ? (
  <MapPlots 
    title='Active Emergencies' 
    markers={emergencyMarkers} 
    bounds={activeEmergencies.length > 0 ? getMapBounds(activeEmergencies) : undefined} 
    zoom={12} 
  />
) : (
  <Card>
    <CardHeader>Active Emergencies</CardHeader>
    <CardContent className="h-96 flex items-center justify-center">
      <p className="text-gray-500">No active emergencies to display on the map</p>
    </CardContent>
  </Card>
)}
</div>
        </div>
    )
}

export default Dashboard;