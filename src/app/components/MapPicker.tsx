"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";

type Coords = { lat: number; lng: number };

type MapPickerProps = {
  onSelect: (coords: Coords) => void;
  lat?: number | null;
  lng?: number | null;
};

export default function MapPicker({ onSelect, lat, lng }: MapPickerProps) {
  const defaultCenter =
    lat && lng ? { lat, lng } : { lat: 10.8505, lng: 76.2711 }; // Kerala center

  const [position, setPosition] = useState<Coords | null>(
    lat && lng ? { lat, lng } : null
  );
  const [searchText, setSearchText] = useState("");

  // Update position when editing a site
  useEffect(() => {
    if (lat && lng) {
      setPosition({ lat, lng });
    }
  }, [lat, lng]);

  // Fly animation to searched/selected place
  function FlyToPosition({ coords }: { coords: Coords | null }) {
    const map = useMap();

    useEffect(() => {
      if (coords) {
        map.flyTo(coords, 16, { duration: 1 });
      }
    }, [coords]);

    return null;
  }

  // Click on map → update marker and parent form
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(coords);
        onSelect(coords);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  // Search place from Nominatim API
  const searchPlace = async (query: string) => {
    if (!query.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );

    const data = await res.json();
    if (!data.length) {
      alert("Place not found");
      return;
    }

    const coords = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };

    setPosition(coords);
    onSelect(coords);
  };

  // GPS locate
  const locateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        onSelect(coords);
      },
      () => alert("Unable to fetch location")
    );
  };

  return (
    <div className="space-y-4 w-full text-black">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search place..."
          className="w-full p-2 border rounded text-black"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchPlace(searchText)}
        />

        <button
          onClick={locateMe}
          className="px-3 bg-blue-600 text-white rounded"
        >
          📍 Me
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[350px] rounded-xl overflow-hidden">
        <MapContainer
          center={position ?? defaultCenter}  // 🔥 IMPORTANT FIX
          zoom={position ? 16 : 12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FlyToPosition coords={position} />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
}
