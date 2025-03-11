import {Link, useNavigate} from 'react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react'
import { Emergency } from '@/models/emergency';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapPlots, { MapMarker } from '@/components/map-plots';
import { createCustomIcon, getMapBounds } from '@/lib/utils';
import Loader from '@/components/loader';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Emergencies(){
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [emergencyMarkers, setEmergencyMarkers] = useState<MapMarker[]>([]);



    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                setLoading(true);
                let url = `${backendUrl}/api/emergency`;
                if (filter !== 'all') {
                    url += `?status=${filter}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setEmergencies(data.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch emergencies');
                setLoading(false);
            }
        };
        fetchEmergencies();
    }, [filter]);

    useEffect(() => {
        const markers = emergencies.map(emergency => ({
            id: emergency.id,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            icon: createCustomIcon(emergency.type),
            popupContent: (
                <div>
                    <h3>{emergency.type}</h3>
                    <p>{emergency.description}</p>
                    <Link to={`/emergencies/${emergency.id}`}>View Details</Link>
                    <div className='my-2'>
                        <Badge variant={emergency.status === 'active' ? 'destructive' : 'default'}>
                            {emergency.status}
                        </Badge>
                    </div>
                    <div>
                        Reported at: {new Date(emergency.createdAt).toLocaleString()}
                    </div>
                </div>
            )
        }));
        setEmergencyMarkers(markers);
    }, [emergencies]);

    const handleFilterChange = (value: string) => {
        setFilter(value);
    }

    if (loading) return (
        <Loader />
    )

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>
    )

    return (
        <div className="container mx-auto p-4">
            <h1 className='text-2xl font-bold text-center mb-4'>Emergencies</h1>
            
            <div className="mb-4">
                <Select onValueChange={handleFilterChange} value={filter}>
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value='all'>All</SelectItem>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='resolved'>Resolved</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="table" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                    <Table>
                        <TableCaption>View Emergencies</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Updated At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emergencies.map((emergency) => {
                                return(
                                    <TableRow className='hover:bg-gray-100 hover:cursor-pointer' onClick={()=> navigate(`/emergencies/${emergency.id}`)}>
                                        <TableCell>
                                            {emergency.id}
                                        </TableCell>
                                        <TableCell>{emergency.type}</TableCell>
                                        <TableCell>{emergency.description}</TableCell>
                                        <TableCell>{emergency.latitude}, {emergency.longitude}</TableCell>
                                        <TableCell>
                                            <Badge variant={emergency.status === 'active' ? 'destructive' : 'default'}>{emergency.status}</Badge>
                                        </TableCell>
                                        <TableCell>{new Date(emergency.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(emergency.updatedAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="map">
                    <div className="h-[600px]">
                        <MapPlots 
                            title={`${filter === 'all' ? 'All' : filter} Emergencies`}
                            markers={emergencyMarkers}
                            bounds={getMapBounds(emergencies)}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Emergencies;