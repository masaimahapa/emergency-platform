import {Link} from 'react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect } from 'react'

import { Emergency } from '@/models/emergency';

function Emergencies(){
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);

    useEffect(() => {
        const fetchEmergencies = async () => {
            const response = await fetch('/api/emergency');

            const data = await response.json();
            setEmergencies(data.data);
        }
        fetchEmergencies();
    }, []);
    return (
        <div>
            <h1 className='text-2xl font-bold text-center mb-4'>Emergencies</h1>
            <Table>
                <TableCaption>View Emergencies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
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
                            <TableRow key={emergency.id}>
                                <TableCell>{emergency.id}</TableCell>
                                <TableCell>
                                    <Link
                                    to={`/emergencies/${emergency.id}`}
                                    >
                                    {emergency.name}
                                    </Link>
                                    </TableCell>
                                <TableCell>{emergency.description}</TableCell>
                                <TableCell>{emergency.latitude}, {emergency.longitude}</TableCell>
                                <TableCell>{emergency.status}</TableCell>
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