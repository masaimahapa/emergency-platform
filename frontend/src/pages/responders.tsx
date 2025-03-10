import {useEffect, useState} from 'react';
import {Responder} from '@/models/responder';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

function RespondersPage(){
    const [responders, setResponders] = useState<Responder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResponders = async () => {
            const response = await fetch('/api/responders');
            const data = await response.json();
            setResponders(data.data);
        }
        fetchResponders();
    }, []);
    
    return(
        <div>
            <h1>Responders</h1>
            <div className='grid grid-cols-1  gap-4'>
                {responders.map((responder) => (
                    <div key={responder.id} className='border p-4 rounded-md'>
                        <h2>{responder.name}</h2>
                        <p>{responder.phoneNumber}</p>
                        <p>{responder.status}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RespondersPage;