import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const userLocationIcon = L.icon({
  iconUrl: "/4965.png", // ここは自分でアイコンファイルを指定してください
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

interface MapComponentProps {
  userLocation: [number, number] | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation }) => {
  return (
    <div className="map-container" style={{ height: "100vh", width: "100%" }}>
      {userLocation ? (
        <MapContainer
          center={userLocation}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLocation} icon={userLocationIcon} />
        </MapContainer>
      ) : (
        <p>現在地を取得中...</p>
      )}
    </div>
  );
};

export default MapComponent;