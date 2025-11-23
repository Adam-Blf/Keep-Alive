import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Activity, Server, Map as MapIcon, GraduationCap, Briefcase, Plane } from 'lucide-react';

// Locations data based on resume
const locations = [
  { id: 1, name: 'EFREI Paris', type: 'education', coords: [48.7888, 2.3637], desc: 'Mastère Data Engineering & AI' },
  { id: 2, name: 'ISIT Paris', type: 'education', coords: [48.8098, 2.3357], desc: 'Bachelor Communication Digitale' },
  { id: 3, name: 'Universidad de Málaga', type: 'education', coords: [36.7213, -4.4214], desc: 'Erasmus - Communication & Médias' },
  { id: 4, name: 'EPSM Lille-Métropole', type: 'work', coords: [50.6553, 3.0566], desc: 'Chargé de communication digitale' },
  { id: 5, name: 'DE NOUVEL ARCHITECT', type: 'work', coords: [50.6292, 3.0573], desc: 'Stagiaire Communication (Lille)' },
  { id: 6, name: 'BNP Paribas', type: 'work', coords: [48.8722, 2.3328], desc: 'Assistant Scrum Master (Paris)' },
  { id: 7, name: 'Marine Nationale', type: 'work', coords: [48.3904, -4.4861], desc: 'Préparation Militaire Marine (Brest/Estimé)' }
];

const StatusCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [lastPing, setLastPing] = useState('-');

  useEffect(() => {
    // Poll server status
    const checkStatus = async () => {
      try {
        // In production, this would point to the Render URL
        // For dev, we assume localhost or configured proxy
        const res = await fetch('https://keep-alive-service.onrender.com/api/status');
        const data = await res.json();
        setServerStatus(data.status === 'online' ? 'Online' : 'Offline');
        setLastPing(new Date(data.lastPing).toLocaleTimeString());
      } catch (e) {
        setServerStatus('Connecting...'); // Default to connecting or error
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-slate-400">Real-time monitoring & Career Map</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <div className={`w-3 h-3 rounded-full ${serverStatus === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium">{serverStatus}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard 
            title="Monitored Services" 
            value="16" 
            icon={Server} 
            color="text-blue-500" 
          />
          <StatusCard 
            title="Last Ping Cycle" 
            value={lastPing} 
            icon={Activity} 
            color="text-green-500" 
          />
          <StatusCard 
            title="Locations Tracked" 
            value={locations.length} 
            icon={MapIcon} 
            color="text-purple-500" 
          />
        </div>

        {/* Map Section */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 h-[600px] relative">
          <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Education</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Work Experience</span>
              </div>
            </div>
          </div>

          <MapContainer 
            center={[46.2276, 2.2137]} 
            zoom={5} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {locations.map((loc) => (
              <Marker 
                key={loc.id} 
                position={loc.coords}
              >
                <Popup className="custom-popup">
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {loc.type === 'education' ? (
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="font-bold text-slate-900">{loc.name}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{loc.desc}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default App
