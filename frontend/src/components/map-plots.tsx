import { Marker, Popup, TileLayer } from "react-leaflet";

import { MapContainer } from "react-leaflet";
import { Card, CardContent, CardHeader } from "./ui/card";

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

function MapPlots(
    {
        markers,
        bounds,
        title = "Map",
        className="h-96",
        zoom=12
    }: MapPlotsProps
) {
    return (
        <Card>
        <CardHeader>{title}</CardHeader>
        <CardContent className={className}>
            {markers.length >0 && (
                <MapContainer
                bounds={bounds}
                style={{width: '100%', height: '100%'}}
                zoomControl={true}
                zoom={zoom}
                
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {markers.map(marker =>(
                        <Marker key={marker.id} position={[marker.latitude, marker.longitude]}
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
            )}
        </CardContent>
    </Card>     
    )
}

export default MapPlots;