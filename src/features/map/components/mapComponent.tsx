// MapComponent.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
// import { generateClient } from 'aws-amplify/api';
// マーカーアイコンのインポート
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

Amplify.configure(awsExports);

// const client = generateClient();

// デフォルトのアイコン設定を修正
// delete L.Icon.Default.prototype._getIconUrl;


//これ何？
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x.src,
//   iconUrl: markerIcon.src,
//   shadowUrl: markerShadow.src,
// });


// ユーザーアイコンを定義（ユーザーの現在地用）
const userIcon = new L.Icon({
  iconUrl: '4965.png', 
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});
// 投稿ピンのアイコンの定義
const postIcon = new L.Icon({
  iconUrl: 'pin.png',
  iconSize: [40, 40], // アイコンサイズを指定（幅, 高さ）
  iconAnchor: [15, 50],
  popupAnchor: [1, -34],
//   shadowUrl: markerShadow.src,
});


interface Post {
  id: string;
  imageUrl?: string;
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
}

interface MapComponentProps {
  userPosition: [number, number];
  posts: Post[];
}

const MapComponent: React.FC<MapComponentProps> = ({ userPosition, posts }) => {
  return (
    <MapContainer
      center={userPosition}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* ユーザーの現在地にマーカーを表示 */}
      <Marker position={userPosition} icon={userIcon}>
        <Popup>あなたの現在地</Popup>
      </Marker>
      {/* 投稿データのマーカーを表示 */}
      {posts.map((post) => (
        <Marker
          key={post.id}
          position={[post.lat, post.lng]}
          icon={postIcon} // アイコンサイズを統一
        >
          <Popup>
            <h3>{post.category}</h3>
            <p>{post.comment}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.category}
                style={{ maxWidth: '200px' }}
              />
            )}
            <p>投稿者: {post.userId}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;