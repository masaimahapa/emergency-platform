import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Emergency, EmergencyResponse } from '@/models/emergency.ts';
import { Link } from 'react-router';
const EmergencyPage = () => {
    const {id} = useParams();
    const [emergency, setEmergency] = useState<Emergency | null>(null);

    useEffect(() => {
        const fetchEmergency = async () => {
            const response = await fetch(`/api/emergency/${id}`);
            const data : EmergencyResponse = await response.json();
            setEmergency(data.data);
        };
        fetchEmergency();
    }, [id]);
    return (
        <div className='container mx-auto p-4'>
            <Link to="/emergencies" className='mb-4'>Back to Emergencies</Link>
            <h1 className='text-2xl font-bold text-center mb-4'>Emergency Details for {emergency?.id}</h1>
            {emergency && (
                <div className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-bold'>{emergency.name}</h2>
                    <p className='text-gray-600'>{emergency.description}</p>
                    <p className='text-gray-600'>{emergency.location.latitude}, {emergency.location.longitude}</p>
                    <p className='text-gray-600'>{emergency.status}</p>
                    <p className='text-gray-600'>{emergency.createdAt}</p>
                    <p className='text-gray-600'>{emergency.updatedAt}</p>
                </div>
            )}
        </div>
    )
};

export default EmergencyPage;