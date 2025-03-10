import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
function StatCard({title, value}: {title: string, value: number}){
    return(
        <Card>
    <CardHeader>
        <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
        <span className='text-2xl font-bold'>{value}</span>
    </CardContent>
</Card>
    )
}

export default StatCard;