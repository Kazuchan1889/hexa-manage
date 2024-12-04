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

// Data dummy untuk lokasi
const initialLocations = [
  { id: 1, name: "Lokasi 1", lat: -6.2088, lng: 106.8456 },
  { id: 2, name: "Lokasi 2", lat: -6.2200, lng: 106.8500 },
  { id: 3, name: "Lokasi 3", lat: -6.2100, lng: 106.8600 },
  { id: 4, name: "Lokasi 4", lat: -6.2150, lng: 106.8550 },
  { id: 5, name: "Lokasi 5", lat: -6.2050, lng: 106.8450 },
  { id: 6, name: "Lokasi 6", lat: -6.2300, lng: 106.8400 },
  { id: 7, name: "Lokasi 7", lat: -6.2400, lng: 106.8300 },
  { id: 8, name: "Lokasi 8", lat: -6.2500, lng: 106.8200 },
];

const LocationPickerPage = () => {
  const [coordinates, setCoordinates] = useState({ lat: -6.2088, lng: 106.8456 }); // Default: Jakarta
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState(initialLocations);
  const [newLocation, setNewLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });

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

  const handleAddLocation = () => {
    if (newLocation.name && coordinates.lat && coordinates.lng) {
      const newId = locations.length ? locations[locations.length - 1].id + 1 : 1;
      const newLocationData = {
        id: newId,
        name: newLocation.name,
        lat: coordinates.lat, // Menggunakan koordinat dari peta atau lokasi pengguna
        lng: coordinates.lng, // Menggunakan koordinat dari peta atau lokasi pengguna
      };
      setLocations([...locations, newLocationData]);
      setNewLocation({ name: "", lat: "", lng: "" }); // Reset form setelah penambahan
      Swal.fire("Berhasil", "Lokasi berhasil ditambahkan.", "success");
    } else {
      Swal.fire("Error", "Silakan lengkapi data lokasi dan pilih lokasi di peta.", "error");
    }
  };

  return (
    <div className="p-6 ">
      <NavbarUser />
      <h2 className="text-2xl font-bold mx-2 mb-4">Geotech</h2>
      <div className="flex overflow-hidden">
        {/* Peta */}
        <div
          className="relative w-full h-1/2 lg:w-3/4 h-1/2"
          style={{ aspectRatio: "1 / 0.5" }}
        >
          {mapReady && (
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
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

          {/* Form Input untuk Menambahkan Lokasi */}
          <div className="w-full border border-gray-300 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Tambah Lokasi Baru:</h3>
            <input
              type="text"
              className="w-full px-4 py-2 mb-2 border border-gray-300 rounded"
              placeholder="Nama Lokasi"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            />
            <button
              onClick={handleAddLocation}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Add Lokasi
            </button>
          </div>

          {/* Daftar Lokasi dalam Tabel */}
          <div className="w-full border border-gray-300 p-4 rounded overflow-y-auto" style={{ maxHeight: "200px" }}>
            <h3 className="font-bold mb-2">Daftar Lokasi:</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Nama Lokasi</th>
                  <th className="px-4 py-2 border">Latitude</th>
                  <th className="px-4 py-2 border">Longitude</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td className="px-4 py-2 border">{location.name}</td>
                    <td className="px-4 py-2 border">{location.lat.toFixed(3)}</td>
                    <td className="px-4 py-2 border">{location.lng.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerPage;
