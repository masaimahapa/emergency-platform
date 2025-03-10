import {Link} from 'react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect } from 'react'

import { Emergency } from '@/models/emergency';
import { Badge } from '@/components/ui/badge';

function Emergencies(){
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/emergency');

            const data = await response.json();
        
            setEmergencies(data.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch emergencies');
            setLoading(false);
        }
    };
    fetchEmergencies();
    }, []);



    if (loading) return (
        <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    )

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
    </div>
    )
    return (
        <div>
            <h1 className='text-2xl font-bold text-center mb-4'>Emergencies</h1>
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
                            <TableRow className='hover:bg-gray-100 hover:cursor-pointer'>

                                <TableCell>
                            <Link to={`/emergencies/${emergency.id}`} key={emergency.id}>
                                    
                                    {emergency.id}
                                    
                                    </Link>
                                    </TableCell>
                                <TableCell>
                      
                                    {emergency.type}
                        
                                    </TableCell>
                                <TableCell>{emergency.description}</TableCell>
                                <TableCell>{emergency.latitude}, {emergency.longitude}</TableCell>
                                <TableCell>
                                    <Badge variant={emergency.status === 'active' ? 'destructive' : 'default'}>{emergency.status}</Badge></TableCell>
                                <TableCell>{new Date(emergency.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(emergency.updatedAt).toLocaleString()}</TableCell>
                            
                            </TableRow>
                        )
                    })}
                    </TableBody>
                    
            </Table>
        </div>
    )
}

export default Emergencies;