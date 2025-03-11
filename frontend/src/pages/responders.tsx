import {useEffect, useState} from 'react';
import {Responder} from '@/models/responder';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapPlots, { MapMarker } from '@/components/map-plots';
import { createResponderIcon, getMapBounds } from '@/lib/utils';
import Loader from '@/components/loader';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


function RespondersPage(){
    const [responders, setResponders] = useState<Responder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [responderMarkers, setResponderMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        const fetchResponders = async () => {
            try{
                setLoading(true);
                let url = `${backendUrl}/api/responders`;
                if (filter !== 'all') {
                    url += `?status=${filter}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setResponders(data.data);
                setLoading(false);
            } catch(error){
                setError(error as string);
                setLoading(false);
            }
        }
        fetchResponders();
    }, [filter]);

    useEffect(() => {
        const markers = responders.map(responder => ({
            id: responder.id,
            latitude: responder.latitude,
            longitude: responder.longitude,
            icon: createResponderIcon(responder.type, responder.status === 'active' ? 'green' : 'gray'),
            popupContent: (
                <div>
                    <h3>{responder.name}</h3>
                    <p>Type: {responder.type}</p>
                    <Link to={`/responders/${responder.id}`}>View Details</Link>
                    <div className='my-2'>
                        <Badge variant={responder.status === 'active' ? 'default' : 'destructive'}>
                            {responder.status}
                        </Badge>
                    </div>
                    <div>
                        Last Updated: {new Date(responder.updatedAt).toLocaleString()}
                    </div>
                </div>
            )
        }));
        setResponderMarkers(markers);
    }, [responders]);

    const handleFilterChange = (value: string) => {
        setFilter(value);
    }

    if (loading) return <Loader />;

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>
    );
    
    return(
        <div className="container mx-auto p-4">
            <h1 className='text-2xl font-bold text-center mb-4'>Responders</h1>
            
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
                            <SelectItem value='assigned'>Assigned</SelectItem>
                            <SelectItem value='offline'>Offline</SelectItem>
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
                        <TableCaption>Responders</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responders.map((responder) => (
                                <TableRow key={responder.id}>
                                    <TableCell>
                                        <Link to={`/responders/${responder.id}`}>
                                            {responder.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/responders/${responder.id}`}>
                                            {responder.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={responder.status === 'active' ? 'default' : 'destructive'}>
                                            {responder.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{responder.type}</TableCell>
                                    <TableCell>{responder.latitude}, {responder.longitude}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="map">
                    <div className="h-[600px]">
                        <MapPlots 
                            title={`${filter === 'all' ? 'All' : filter} Responders`}
                            markers={responderMarkers}
                            zoom={12}
                            bounds={getMapBounds(responders)}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default RespondersPage;