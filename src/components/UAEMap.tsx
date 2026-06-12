"use client";

import { useState } from "react";
import Link from "next/link";

export interface MapSite {
  id: string;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  projectName: string;
  manpowerCount: number;
  pendingRequests: number;
}

// Project UAE lat/lng onto the SVG viewBox (0 0 600 420).
// UAE bounds approx: lat 22.5–26.2, lng 51.4–56.5
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 51.4) / (56.5 - 51.4)) * 560 + 20;
  const y = ((26.2 - lat) / (26.2 - 22.5)) * 380 + 20;
  return { x, y };
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "#10b981",
  ON_HOLD: "#f59e0b",
  PLANNED: "#3b82f6",
  COMPLETED: "#94a3b8",
};

/**
 * Stylized SVG map of the UAE with project site markers.
 * Swappable for Leaflet/Mapbox tiles in production (see docs/ARCHITECTURE.md).
 */
export function UAEMap({ sites }: { sites: MapSite[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const placed = sites.filter((s) => s.latitude != null && s.longitude != null);

  return (
    <div className="relative">
      <svg viewBox="0 0 600 420" className="w-full" role="img" aria-label="UAE site map">
        {/* Simplified UAE landmass silhouette */}
        <path
          d="M 60 240
             C 80 200, 130 170, 180 160
             C 230 150, 270 130, 310 110
             C 350 92, 400 80, 440 70
             C 470 63, 500 70, 520 95
             C 540 120, 545 160, 540 200
             C 536 235, 520 250, 500 255
             C 480 260, 470 250, 460 235
             C 450 250, 445 270, 450 295
             C 430 300, 400 295, 380 305
             C 350 320, 310 330, 270 330
             C 220 330, 160 320, 120 300
             C 90 285, 65 265, 60 240 Z"
          className="fill-slate-200 stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-700"
          strokeWidth="2"
        />
        {/* Gulf label */}
        <text x="150" y="80" className="fill-slate-400 text-[13px] italic dark:fill-slate-500">
          Arabian Gulf
        </text>

        {placed.map((s) => {
          const { x, y } = project(s.latitude!, s.longitude!);
          const color = STATUS_COLOR[s.status] ?? "#3b82f6";
          const isHover = hovered === s.id;
          return (
            <g
              key={s.id}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle cx={x} cy={y} r={isHover ? 14 : 10} fill={color} opacity="0.25">
                <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={isHover ? 7 : 5.5} fill={color} stroke="white" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip rendered as HTML overlay */}
      {placed.map((s) => {
        if (hovered !== s.id) return null;
        const { x, y } = project(s.latitude!, s.longitude!);
        return (
          <Link
            key={s.id}
            href={`/sites/${s.id}`}
            className="card absolute z-10 w-52 -translate-x-1/2 p-3 text-xs shadow-lg"
            style={{ left: `${(x / 600) * 100}%`, top: `${(y / 420) * 100 + 4}%` }}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="font-bold">{s.name}</div>
            <div className="text-slate-500">{s.projectName}</div>
            <div className="mt-1 text-slate-500">📍 {s.location}</div>
            <div className="mt-1 flex justify-between">
              <span>👷 {s.manpowerCount}</span>
              <span>📦 {s.pendingRequests} pending</span>
            </div>
          </Link>
        );
      })}

      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(STATUS_COLOR).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            {k.replaceAll("_", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}
