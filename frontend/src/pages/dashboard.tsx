import React, { useEffect, useState } from 'react'
import {Emergency} from '@/models/emergency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/stat-card';

function Dashboard(){
    const [activeEmergencies, setActiveEmergencies] = useState<Emergency[]>([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        activeEmergencies: 0,
        totalResponders: 0,
        availableResponders: 0
    })
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
        </div>
    )
}

export default Dashboard;