import React from 'react';

/* Line icons for the Hazardous Goods product categories, one per SIRA
   regulated category. Sized to sit inline in the dropdown rows. */

const S = 18;
const base = {
  width: S, height: S, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.7,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
};

export const HAZARDOUS_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Airguns And Accessories': (
    <svg {...base}><path d="M3 9h13l3 3h2v3h-5l-2-2H8v4H5v-4H3z" /><path d="M8 15l-2 5" /></svg>
  ),
  'Armored Vehicles': (
    <svg {...base}><path d="M2 15V9h11l3 3h6v3" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" /></svg>
  ),
  'Chemical Materials': (
    <svg {...base}><path d="M9 3v6L4 19a1.5 1.5 0 001.3 2h13.4A1.5 1.5 0 0020 19l-5-10V3" /><path d="M8 3h8" /><path d="M6.6 14h10.8" /></svg>
  ),
  'Emergency Flare': (
    <svg {...base}><path d="M12 21c3 0 5-2.2 5-5 0-3.4-3-4.6-2.4-9C11.5 8.5 7 9.6 7 16c0 2.8 2 5 5 5z" /></svg>
  ),
  'Explosives': (
    <svg {...base}><circle cx="11" cy="15" r="6" /><path d="M15.5 10.5L18 8" /><path d="M18 8c0-2 1.5-3 3-3" /><path d="M4 8l1.6 1M7 4l.6 1.8M2 13l1.9-.4" /></svg>
  ),
  'Fireworks': (
    <svg {...base}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /><circle cx="12" cy="12" r="2" /></svg>
  ),
  'Military Equipment': (
    <svg {...base}><path d="M3 18h18" /><path d="M5 18v-3h14v3" /><path d="M8 15V9h8v6" /><path d="M10 9V5h4v4" /></svg>
  ),
  'Other Dangerous Materials': (
    <svg {...base}><path d="M12 3L2 20h20L12 3z" /><path d="M12 10v4M12 17v.01" /></svg>
  ),
  'Other Hazardous Materials': (
    <svg {...base}><circle cx="12" cy="12" r="2.4" /><path d="M12 9.6L9.4 5A8 8 0 0114.6 5L12 9.6z" /><path d="M10.1 13.4L5.2 15.2A8 8 0 017.8 10l2.3 3.4z" /><path d="M13.9 13.4l4.9 1.8A8 8 0 0116.2 10l-2.3 3.4z" /></svg>
  ),
  'Weapons And Ammunition': (
    <svg {...base}><path d="M3 8h12l4 4h2v3h-6l-2-2H7v4H4v-4H3z" /><path d="M7 15l-2 5M11 4v3M15 4v3" /></svg>
  ),
};

export const GOODS_CONTROL_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Drone': (
    <svg {...base}><circle cx="5" cy="6" r="2.2" /><circle cx="19" cy="6" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="18" r="2.2" /><rect x="9" y="10" width="6" height="4" rx="1" /><path d="M6.6 7.6L9 10M17.4 7.6L15 10M6.6 16.4L9 14M17.4 16.4L15 14" /></svg>
  ),
  'Spare Parts': (
    <svg {...base}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 008.9 19a1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 8.9a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V10a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
  ),
  'Other Dual Use Goods': (
    <svg {...base}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 16l9 5 9-5" /></svg>
  ),
  'Security Product': (
    <svg {...base}><path d="M12 3l8 3v6c0 4.4-3.2 8.3-8 9-4.8-.7-8-4.6-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
};

/** Icon for a product category, whichever permit type it belongs to. */
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ...GOODS_CONTROL_CATEGORY_ICONS,
  ...HAZARDOUS_CATEGORY_ICONS,
};
