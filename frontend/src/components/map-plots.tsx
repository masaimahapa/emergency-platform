import { Marker, Popup, TileLayer, MapContainer, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader } from "./ui/card";
import L from "leaflet";
import { useEffect } from "react";

export interface MapMarker {
    id: string| number;
    latitude: number;
    longitude: number;
    popupContent?: React.ReactNode;
    icon?: L.Icon | L.DivIcon;
}

export interface MapPlotsProps {
    markers: MapMarker[];
    bounds?: L.LatLngBounds;
    title?: string;
    className?: string;
    height?: string;
    zoom?: number;
    center?: [number, number];
}

function FitBounds({ bounds }: { bounds?: L.LatLngBounds }) {
    const map = useMap();
    
    useEffect(() => {
        if (bounds && bounds.isValid()) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);
    
    return null;
}


function MapPlots({
    markers,
    bounds,
    title = "Map",
    className = "h-96",
    zoom = 11,
    center
}: MapPlotsProps) {
    const mapCenter = center || (markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [0, 0]);
    
    return (
        <Card>
            <CardHeader>{title}</CardHeader>
            <CardContent className={className}>
                <MapContainer
                    center={mapCenter as [number, number]}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    {bounds && <FitBounds bounds={bounds} />}
                    
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {markers.map(marker => (
                        <Marker 
                            key={marker.id} 
                            position={[marker.latitude, marker.longitude]}
                            icon={marker.icon}
                        >
                            {marker.popupContent && (
                                <Popup>
                                    {marker.popupContent}
                                </Popup>
                            )}
                        </Marker>
                    ))}
                </MapContainer>
            </CardContent>
        </Card>
    );
}

export default MapPlots;