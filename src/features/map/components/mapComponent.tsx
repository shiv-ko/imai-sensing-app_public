import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapModal from '../modal/mapModal'; // モーダルコンポーネントをインポート

const userIcon = new L.Icon({
  iconUrl: '4965.png',
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const postIcon = new L.Icon({
  iconUrl: 'pin.png',
  iconSize: [40, 40],
  iconAnchor: [15, 50],
  popupAnchor: [1, -34],
});

interface Post {
  id: string;
  imageUrl?: string | null;
  userId: string;
  lat: number;
  lng: number;
  category: string;
  comment: string;
  reported: boolean;
  deleted: boolean;
  visible: boolean;
  point: number;
  postType: string;
  postedby?: string | null;
}

interface MapComponentProps {
  userPosition: [number, number];
  posts: Post[];
  userId: string; // ユーザーIDを取得
}

// マップ上で現在地に移動するためのカスタムフック
const MoveToCurrentLocationButton: React.FC<{ userPosition: [number, number] }> = ({ userPosition }) => {
  const map = useMap(); // マップインスタンスを取得

  const handleMoveToCurrentLocation = () => {
    map.flyTo(userPosition, 13); // 現在地にズーム移動する
  };

  return (
    <button onClick={handleMoveToCurrentLocation} style={currentLocationButtonStyle}>
      現在地に移動
    </button>
  );
};

const PostMarker: React.FC<{ post: Post; userId: string }> = ({ post, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handlePopupOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  

  return (
    <>
      <Marker
        position={[post.lat, post.lng]}
        icon={postIcon}
        eventHandlers={{
          click: handlePopupOpen, // モーダルを開く
        }}
      />
      <MapModal 
        post={post} 
        userId={userId} // ユーザーIDを渡す
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </>
  );
};

const Markers: React.FC<{ posts: Post[]; userId: string }> = ({ posts, userId }) => {
  return (
    <>
      {posts.map((post) => (
        <PostMarker key={post.id} post={post} userId={userId} />
      ))}
    </>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ userPosition, posts, userId }) => {
  return (
    <div style={mapWrapperStyle}>
      <MapContainer center={userPosition} zoom={13} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userPosition} icon={userIcon}>
          <Popup>あなたの現在地</Popup>
        </Marker>
        <Markers posts={posts} userId={userId} />
        <MoveToCurrentLocationButton userPosition={userPosition} />
      </MapContainer>
    </div>
  );
};

// スタイル定義
const mapWrapperStyle: React.CSSProperties = {
  margin: '0 auto',
  border: '5px solid green',
  width: '90%',
  padding: '10px',
  borderRadius: '10px',
};

const mapStyle: React.CSSProperties = {
  height: '500px',
  width: '100%',
};

const currentLocationButtonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  zIndex: 1000, // マップの上にボタンを表示するための優先度
};

export default MapComponent;
