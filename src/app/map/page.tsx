"use client"; 
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const UserLocation = dynamic(() => import('../../components/map/userlocation'), { ssr: false });


const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // クライアントサイドにいるか確認
  }, []);

  return (
    <div>
      {isClient ? <UserLocation /> : <p>Loading map...</p>}
    </div>
  );
};

export default App;
