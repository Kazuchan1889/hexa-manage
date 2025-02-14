import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavbarUser from "../feature/NavbarUser";
import axios from "axios";
import ip from "../ip";  // Import the IP configuration
import Sidebar from "../feature/Sidebar";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    // Fetch locations from backend on component mount
    fetchAllLocations();
  }, []);

  // Fetch all locations from backend
  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(`${ip}/api/geolocation/get/kantor/all`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),  // Assuming the token is in localStorage
        },
      });
      setLocations(response.data);
      setMapReady(true);
    } catch (error) {
      console.error("Error fetching locations", error);
      Swal.fire("Error", "Failed to fetch locations from backend.", "error");
      setMapReady(true);
    }
  };

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
        },
        {
          enableHighAccuracy: true, // Meminta akurasi tinggi
          timeout: 50000, // Batas waktu 10 detik untuk mendapatkan lokasi
          maximumAge: 0, // Tidak menggunakan lokasi yang sudah ada
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
      // Add the new location to the backend
      axios
        .post(
          `${ip}/api/geolocation/post/kantor`,
          {
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            lokasi: newLocation.name,
          },
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),  // Use token for authentication
            },
          }
        )
        .then((response) => {
          setLocations([...locations, response.data[0]]);
          setNewLocation({ name: "", lat: "", lng: "" }); // Reset form after adding
          Swal.fire("Berhasil", "Lokasi berhasil ditambahkan.", "success");
        })
        .catch((error) => {
          Swal.fire("Error", "Gagal menambahkan lokasi.", "error");
        });
    } else {
      Swal.fire("Error", "Silakan lengkapi data lokasi dan pilih lokasi di peta.", "error");
    }
  };

  const deleteLocation = async (id) => {
    try {
      const response = await fetch(`${ip}/api/geolocation/delete/kantor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken"),  // Use token for authentication
        },
      });

      if (response.ok) {
        Swal.fire("Berhasil", "Lokasi berhasil dihapus.", "success");
        // Refresh the locations list after deletion
        fetchAllLocations();
      } else {
        // Log status code for debugging
        const errorMessage = await response.text(); // Get the error message from the response
        console.error(`Failed to delete location. Status: ${response.status}, Message: ${errorMessage}`);
        Swal.fire("Error", "Gagal menghapus lokasi.", "error");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus lokasi.", "error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto">
        <div className="bg-[#11284E] text-white p-6 shadow-lg h-48">
          <h1 className="text-2xl font-bold">Schedjule</h1>
          <div className="mt-4 flex justify-end items-center w-full pr-4 sm:pr-16">

          </div>


          <div className="container mx-auto px-2 sm:px-4 mt-6 flex flex-col lg:flex-row min-h-[580px] overflow-hidden">
            <div className="w-full lg:w-1/3 p-4 sm:p-6 rounded-l-xl bg-[#DFEBFE] border-b lg:border-b-0 lg:border-r border-gray-200 flex justify-center">
              <div className="scale-100 sm:scale-125 transform translate-y-20 sm:translate-y-28 text-center">


              </div>
              {/* Peta */}
              <div className="relative w-full h-2/3 lg:w-full mx-auto mt-20" style={{ aspectRatio: "1 / 1" }}>
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
                      <Marker position={[coordinates.lat, coordinates.lng]} icon={markerIcon}></Marker>
                    )}
                  </MapContainer>
                )}
              </div>

            </div>  


            <div className="w-full lg:w-2/3 rounded-r-xl py-2 sm:p-4 md:p-6 bg-white flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h2 className="text-xl sm:text-2xl text-black font-bold">Geo Tech</h2>
              </div>
              <div className="flex flex-col items-center gap-3">

                {/* Tombol */}
                <div className="w-2/3 text-black">
                  <button
                    onClick={handleUseMyLocation}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-[15px] shadow hover:bg-blue-600 text-base flex items-center"
                  >
                    <MyLocationIcon className="mr-2" />
                    Gunakan Lokasi Anda
                  </button>

                  <button
                    onClick={handleSetLocation}
                    className="w-full px-4 py-2 mt-2 bg-green-500 text-white rounded-[15px] shadow hover:bg-green-600 text-base flex items-center"
                  >
                    <LocationOnIcon className="mr-2" />
                    Set Location
                  </button>
                </div>

                {/* Latitude dan Longitude */}
                <div className="w-2/3 border border-gray-300 p-3 rounded-[15px] text-center text-base text-black">
                  <strong>Latitude:</strong> {coordinates.lat || "-"}
                </div>
                <div className="w-2/3 border border-gray-300 p-3 rounded-[15px] text-center text-base text-black">
                  <strong>Longitude:</strong> {coordinates.lng || "-"}
                </div>

                {/* Form Input untuk Menambahkan Lokasi */}
                <div className="w-2/3 border border-gray-300 p-4 rounded-[15px] mb-4">
                  <h3 className="font-bold text-black mb-2 text-xl">Tambah Lokasi Baru:</h3>
                  <input
                    type="text"
                    className="w-full text-black px-4 py-2 mb-2 border border-gray-300 rounded-[15px] text-base"
                    placeholder="Nama Lokasi"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  />
                  <button
                    onClick={handleAddLocation}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-[15px] shadow hover:bg-blue-600 text-base"
                  >
                    Add Lokasi
                  </button>
                </div>

                {/* Daftar Lokasi dalam Tabel */}
                <div className="w-2/3 border border-gray-300 p-4 rounded-[15px] overflow-y-auto text-black" style={{ maxHeight: "200px" }}>
                  <h3 className="font-bold mb-2 text-xl">Daftar Lokasi:</h3>
                  <table className="w-full table-auto text-base">
                    <thead>
                      <tr>
                        <th className="px-1 py-2 border">Nama Lokasi</th>
                        <th className="px-4 py-2 border">Latitude</th>
                        <th className="px-4 py-2 border">Longitude</th>
                        <th className="px-4 py-2 border">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.map((location) => (
                        <tr key={location.id} className="text-sm">
                          <td className="px-1 py-2 border">{location.lokasi}</td>
                          <td className="px-4 py-2 border">{location.latitude}</td>
                          <td className="px-4 py-2 border">{location.longitude}</td>
                          <td className="px-4 py-2 border">
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded-[15px] text-sm"
                              onClick={() => deleteLocation(location.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>


            </div>

          </div>
        </div>
      </div>
    </div>




  );
};

export default LocationPickerPage;
