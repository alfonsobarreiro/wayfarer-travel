"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { allDestinations as destinations, type Destination } from "@/data/destinations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface DestinationMapProps {
  onSelectDestination?: (dest: Destination) => void;
  selectedSlug?: string;
  className?: string;
}

export function DestinationMap({
  onSelectDestination,
  selectedSlug,
  className = "",
}: DestinationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [30, 20],
      zoom: 1.5,
      projection: "globe",
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(50, 55, 65)",
        "high-color": "rgb(25, 28, 35)",
        "horizon-blend": 0.12,
        "space-color": "rgb(15, 15, 25)",
        "star-intensity": 0.3,
      });
    });

    map.on("load", () => {
      setMapLoaded(true);

      destinations.forEach((dest) => {
        const el = document.createElement("div");
        el.className = "destination-marker";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", `View ${dest.name}`);
        // IMPORTANT: No `transform` on this element — Mapbox owns `transform`
        // for marker positioning. Setting it causes pins to jump to 0,0.
        // Hover feedback uses only background + box-shadow changes.
        // Brand: accent-500 = Terra Cotta per brief ("secondary icons in terra cotta").
        // Hover: accent-700 for darker active feedback.
        const ACCENT = "#D27A5E";
        const ACCENT_HOVER = "#8F4A37";
        el.style.cssText = `
          width: 32px;
          height: 32px;
          background: ${ACCENT};
          border: 2.5px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: background 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

        const handleSelect = () => {
          onSelectDestination?.(dest);
          map.flyTo({
            center: [dest.coordinates.lng, dest.coordinates.lat],
            zoom: 5,
            duration: 2000,
            essential: true,
          });
        };

        el.addEventListener("mouseenter", () => {
          el.style.background = ACCENT_HOVER;
          el.style.boxShadow = "0 4px 14px rgba(210,122,94,0.5)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.background = ACCENT;
          el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        });
        el.addEventListener("click", handleSelect);
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect();
          }
        });

        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          className: "wayfarer-popup",
        }).setHTML(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="font-size: 14px;">${dest.name}</strong>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0;">${dest.tagline}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([dest.coordinates.lng, dest.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedSlug) return;
    const dest = destinations.find((d) => d.slug === selectedSlug);
    if (dest) {
      mapRef.current.flyTo({
        center: [dest.coordinates.lng, dest.coordinates.lat],
        zoom: 5,
        duration: 2000,
        essential: true,
      });
    }
  }, [selectedSlug, mapLoaded]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <div className="animate-pulse text-sm text-neutral-400">
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
}
