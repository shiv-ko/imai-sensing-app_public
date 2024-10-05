'use client'
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./mapcomp"), { ssr: false });


const UserLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);

  return <MapComponent userLocation={userLocation} />;
};

export default UserLocation;