// src/components/ComplaintHeatmap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import axios from 'axios';

const ComplaintHeatmap = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.complaints;

        // ✅ Extract lat/lng properly (your complaints use latitude & longitude)
        const heatPoints = data
           .filter(c => c.geo?.lat && c.geo?.lng)  // use geo.lat & geo.lng
           .map(c => [c.geo.lat, c.geo.lng, 0.6]); // intensity 0.6
          console.log("Heatmap points:", heatPoints);
        setPoints(heatPoints);
      } catch (err) {
        console.error('Error fetching complaints for heatmap:', err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer points={points} />
      </MapContainer>
    </div>
  );
};

// Custom HeatLayer hook
const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.3,
    });

    heatLayer.addTo(map);
    return () => map.removeLayer(heatLayer);
  }, [points, map]);

  return null;
};

export default ComplaintHeatmap;
