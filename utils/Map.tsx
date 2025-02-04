// Di file Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

if (typeof window !== 'undefined') {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

interface MapProps {
    position: LatLngTuple;  
    onLocationSelect: (latitude: number, longitude: number) => void;
}

const Map: React.FC<MapProps> = ({ position, onLocationSelect }) => {
    const [mapPosition, setMapPosition] = useState<LatLngTuple>(position);

    useEffect(() => {
        setMapPosition(position);
    }, [position]);

    const handleClick = () => {
        onLocationSelect(mapPosition[0], mapPosition[1]);
    };

    return (
        <MapContainer center={mapPosition} zoom={15} scrollWheelZoom={false} className="w-full h-48 rounded-md z-10" style={{ height: "200px", width: "100%", zIndex: 10}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapPosition} eventHandlers={{ click: handleClick }}>
                <Popup>
                    {`Lat: ${mapPosition[0]}, Lng: ${mapPosition[1]}`}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
