import {useEffect, useState} from 'react';
import {Responder} from '@/models/responder';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
function RespondersPage(){
    const [responders, setResponders] = useState<Responder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchResponders = async () => {
            try{
                setLoading(true);
                let url = '/api/responders';
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

    const handleFilterChange = (value: string) => {
        setFilter(value);
    }
    
    return(
        <div>
            <h1 className='text-2xl font-bold text-center mb-4'>Responders</h1>
            <Select onValueChange={handleFilterChange} value={filter}>
                <SelectTrigger>
                    <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='assigned'>Assigned</SelectItem>
                    <SelectItem value='offline'>Offline</SelectItem>
                </SelectContent>
            </Select>

            <Table>
                <TableCaption>Responders</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
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
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default RespondersPage;