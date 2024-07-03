import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mengatur ikon default untuk Leaflet hanya di sisi klien
if (typeof window !== 'undefined') {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

const Map = () => {
    const position: LatLngTuple = [-6.595038, 106.816635]; // Koordinat contoh (Bogor, Indonesia)

    console.log("Map component rendered"); // Logging

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="w-full h-48 rounded-md z-10" style={{ height: "200px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    F2FQ+V7 Sukamekar, Bogor Regency, West Java, Indonesia
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
