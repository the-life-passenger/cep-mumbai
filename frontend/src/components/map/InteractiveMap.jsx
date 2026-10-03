import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Phone, Navigation, ArrowRight, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin creator
function createCustomPin(color = '#0d9488', isEmergency = false) {
  const pinHtml = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 32px;
        height: 32px;
        background-color: ${isEmergency ? '#dc2626' : color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      "></div>
      <div style="
        position: relative;
        z-index: 2;
        width: 12px;
        height: 12px;
        background-color: #ffffff;
        border-radius: 50%;
        margin-top: -6px;
      "></div>
      ${isEmergency ? '<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220, 38, 38, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: pinHtml,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

// Controller component to smoothly center on selected service or user position
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({
  services = [],
  selectedService = null,
  onSelectService,
  center = [19.0178, 72.8478], // Central Mumbai default (Dadar)
  zoom = 13,
  className = "w-full h-full min-h-[500px]"
}) {
  const activePosition = selectedService
    ? [selectedService.latitude, selectedService.longitude]
    : center;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ minHeight: '100%' }}
      >
        <MapViewController center={activePosition} zoom={selectedService ? 15 : zoom} />
        
        {/* OpenStreetMap Tile Layer - 100% Free & No API Key Needed */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {services.map(service => {
          if (!service.latitude || !service.longitude) return null;
          const isSelected = selectedService && selectedService.id === service.id;
          const pinIcon = createCustomPin(
            service.emergencyAvailable ? '#dc2626' : '#0d9488',
            service.emergencyAvailable
          );

          return (
            <Marker
              key={service.id}
              position={[service.latitude, service.longitude]}
              icon={pinIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectService) onSelectService(service);
                },
              }}
            >
              <Popup className="custom-popup" autoPan={true}>
                <div className="w-64 p-3 bg-white text-slate-800">
                  {/* Image banner if present */}
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      loading="lazy"
                    />
                  )}

                  <div className="flex items-center gap-1.5 mb-1">
                    {service.emergencyAvailable && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        24/7 Emergency
                      </span>
                    )}
                    {service.verified && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {service.name}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 mb-2 line-clamp-1">
                    📍 {service.locality}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{service.openingHours}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Directions
                    </a>

                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
