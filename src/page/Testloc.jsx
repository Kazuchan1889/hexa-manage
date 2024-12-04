import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavbarUser from "../feature/NavbarUser";

// Ikon untuk marker
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationPickerPage = () => {
  const [coordinates, setCoordinates] = useState({ lat: -6.2088, lng: 106.8456 }); // Default: Jakarta
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setMapReady(true);
        },
        () => {
          Swal.fire("Error", "Tidak dapat mengambil lokasi Anda. Menggunakan lokasi default.", "error");
          setMapReady(true);
        }
      );
    } else {
      Swal.fire("Error", "Geolokasi tidak didukung di perangkat Anda.", "error");
      setMapReady(true);
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
      },
    });
    return null;
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
        },
        () => {
          Swal.fire("Error", "Tidak dapat mengambil lokasi Anda.", "error");
        }
      );
    } else {
      Swal.fire("Error", "Geolokasi tidak didukung di perangkat Anda.", "error");
    }
  };

  const handleSetLocation = () => {
    if (coordinates.lat && coordinates.lng) {
      Swal.fire("Berhasil", "Lokasi telah berhasil didaftarkan.", "success");
    } else {
      Swal.fire("Error", "Silakan pilih lokasi terlebih dahulu.", "error");
    }
  };

  return (
    <div className="p-6">
      <NavbarUser />
      <h2 className="text-2xl font-bold mb-4">Geotech</h2>
      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Peta */}
        <div
          className="relative w-full lg:w-3/4"
          style={{ aspectRatio: "1 / 1" }}
        >
          {mapReady && (
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={13}
              style={{ height: "50%", width: "100%" }}
              className="rounded border border-gray-300"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapClickHandler />
              {coordinates.lat && coordinates.lng && (
                <Marker
                  position={[coordinates.lat, coordinates.lng]}
                  icon={markerIcon}
                ></Marker>
              )}
            </MapContainer>
          )}
        </div>

        {/* Panel sebelah kanan */}
        <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start space-y-4 mt-4 lg:mt-0 lg:ml-4">
          {/* Tombol */}
          <div className="space-y-2 w-full">
            <button
              onClick={handleUseMyLocation}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Gunakan Lokasi Anda
            </button>
            <button
              onClick={handleSetLocation}
              className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Set Location
            </button>
          </div>

          {/* Latitude dan Longitude */}
          <div className="w-full border border-gray-300 p-4 rounded text-center">
            <strong>Latitude:</strong> {coordinates.lat || "-"}
          </div>
          <div className="w-full border border-gray-300 p-4 rounded text-center">
            <strong>Longitude:</strong> {coordinates.lng || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerPage;
