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

// カテゴリとピン画像のマッピング
const categoryIconMapping: { [key: string]: string } = {
  '防災器具の場所': 'output/pin_variation_1.png',
  '避難場所': 'output/pin_variation_2.png',
  '道の名前': 'output/pin_variation_3.png',
  '懐かしい場所': 'output/pin_variation_4.png',
  '思い出の場所': 'output/pin_variation_5.png',
  '守りたい場所': 'output/pin_variation_6.png',
  '大切な場所': 'output/pin_variation_7.png',
  '友達に教えてあげたいこと': 'output/pin_variation_8.png',
  'おすすめスポット': 'output/pin_variation_9.png',
  '珍しいもの': 'output/pin_variation_10.png',
  '面白いもの': 'output/pin_variation_11.png',
  '危険な場所': 'output/pin_variation_12.png',
  '注意が必要な場所': 'output/pin_variation_13.png',
  '景観が綺麗な場所': 'output/pin_variation_14.png',
  '写真映えするスポット': 'output/pin_variation_15.png',
  '歴史的な場所': 'output/pin_variation_16.png',
  '地域の名物': 'output/pin_variation_17.png',
  '季節を感じる場所': 'output/pin_variation_18.png',
};

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

function getIconForCategory(category: string): L.Icon {
  const iconUrl = categoryIconMapping[category] || 'pin.png'; // デフォルトのピン画像を設定
  return new L.Icon({
    iconUrl,
    iconSize: [40, 40],      // ピンのサイズを調整
    iconAnchor: [20, 40],    // ピンの位置を調整
    popupAnchor: [0, -40],   // ポップアップの位置を調整
  });
}

// マップ上で現在地に移動するためのカスタムフック
const MoveToCurrentLocationButton: React.FC<{ userPosition: [number, number] }> = ({ userPosition }) => {
  const map = useMap(); // マップインスタンスを取得

  const handleMoveToCurrentLocation = () => {
    map.flyTo(userPosition, 18); // 現在地にズーム移動する
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

  // カテゴリーに応じたアイコンを取得
  const icon = getIconForCategory(post.category);

  return (
    <>
      <Marker
        position={[post.lat, post.lng]}
        icon={icon}
        eventHandlers={{
          click: handlePopupOpen,
        }}
      />
      <MapModal
        post={post}
        userId={userId}
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
      <MapContainer center={userPosition} zoom={16} style={mapStyle}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
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
  height: '60vh',
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
