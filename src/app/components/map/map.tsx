"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: [],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const google = window.google;
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 17.382953193516457, lng: 104.75430617116363 },
          zoom: 15,
          mapTypeId: "terrain",
        });

        setMap(newMap);

        // 🔹 เพิ่ม Markers ลงบนแผนที่
        addMarkers(newMap);
      }
    });
  }, []);

  // 📌 ฟังก์ชันเพิ่ม Markers ลงบนแผนที่
  const addMarkers = (map: google.maps.Map) => {
    const locations = [
      { lat:17.382840248094926, lng: 104.75430780387406},
    ];

    locations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
      });
    });
  };

  return (
    <div>
      <div ref={mapRef} style={{ height: "514px", width: "1377px" }} />
      <button onClick={() => alert(map?.getMapTypeId())}>Get Map Type</button>
      <button onClick={() => map?.setZoom(1)}>Zoom</button>
    </div>
  );
};

export default MapComponent;
