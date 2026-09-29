/* ──────────────────────────────────────────────────────────────
   SIRA — Goods Control Permit
   Shared constants for the listing, journey and request flow.
   Figma: eOyqad8vWolAUPOLvnnoaj
   ────────────────────────────────────────────────────────────── */

export const SIRA_SERVICE_TITLE = 'Goods Control Permit';
export const SIRA_REQUEST_TITLE = 'Goods Control Permit';

/* ── Dropdown option sets (Figma 26:3574 / 26:3563 / 22:16269) ── */
export const REQUEST_TYPES = [
  'Import Permit',
  'Import Clearance',
  'Export Permit',
  'Re-Export Permit',
  'Transit Permit',
  'Transport Permit',
  'Phase Permit',
  'Sale/Purchase Approval Permit',
];

/** Full wording used in the request title for each permit category. */
export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'Hazardous Goods': 'Hazardous Goods Chemical Materials',
};

/** Page title once the request stepper has started. */
export function requestTitleFor(productCategory: string): string {
  const label = PRODUCT_CATEGORY_LABELS[productCategory] ?? productCategory;
  return `Import NOC request - ${label}`;
}

export const PRODUCT_CATEGORIES = [
  'Hazardous Goods',
  'Drone',
  'Spare Parts',
  'Other Dual Use Goods',
  'Security Product',
];

export const TRANSPORTATION_METHODS = [
  'Sea Freight',
  'Air Freight',
  'Rail Freight',
  'Land Freight',
];

export const TRANSIT_VIA_TYPES = ['Direct', 'Single', 'Multiple'];

/* ── Basic search dropdown (Figma 102:3835) ── */
export const SEARCH_FIELDS = ['Request Number', 'AWB/BOL Number', 'License Number'];

/* ── Action column flyout (Figma 22:19701) ── */
export const ROW_ACTIONS = [
  'View Request',
  'Initiate Payment',
  'More Info Required',
  'Download Certificate',
] as const;

/* ── Reference data ── */
export const COUNTRIES = [
  'Afghanistan', 'Albania', 'China', 'Germany', 'India', 'Kenya',
  'New Zealand', 'Singapore', 'United Arab Emirates', 'United Kingdom',
];
export const PORTS = [
  'Jebel Ali', 'Port Rashid', 'Tuticorin', 'Nhava Sheva', 'Mombasa',
  'Shanghai', 'Singapore', 'Port 1', 'Port 2',
];
export const DUBAI_ENTRY_PORTS = ['Jebel Ali', 'Port Rashid', 'DXB Airport', 'Al Maktoum Airport', 'Hatta Border'];
export const DATE_TYPES = ['Request Date', 'Status Date', 'Payment Date', 'Expiry Date'];
export const STORAGES = ['Dubai South', 'Jebel Ali Free Zone', 'DAFZA', 'Al Quoz Depot'];
export const IMPORTERS = [
  'Two Seasons Hotel and Hotel Apartments',
  'MAERSK KAKOO UAE LLC',
  'Sony Gulf UAE',
  'Al Bait Al Mamoor Cargo Llc - Dubai',
];
export const LICENSE_NOS = ['A123456899', 'B998877665', 'C554433221'];
export const WEIGHT_UNITS = ['KG', 'TON', 'LBS', 'G'];
export const HS_BRANDS = ['New', 'Refurbished', 'Used'];
export const HS_MODELS = ['New', 'Model A', 'Model B'];
export const HS_CATEGORIES = ['New', 'Restricted', 'Dual Use'];
export const HS_PURPOSES = ['India', 'Personal Use', 'Commercial Use', 'Re-Export'];

/* ── Listing statuses ── */
export type SiraStatus =
  | 'Payment Pending'
  | 'Submitted'
  | 'Cleared'
  | 'Approved'
  | 'More Info Required'
  | 'Rejected'
  | 'Draft';

export const SIRA_STATUSES: SiraStatus[] = [
  'Payment Pending', 'Submitted', 'Cleared', 'Approved', 'More Info Required', 'Rejected', 'Draft',
];

export const STATUS_STYLE: Record<SiraStatus, { bg: string; color: string }> = {
  'Payment Pending':   { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Submitted':         { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Cleared':           { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Approved':          { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'More Info Required':{ bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Rejected':          { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Draft':             { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

export const STATUS_COLORS: Record<SiraStatus, string> = {
  'Payment Pending': '#b45309', 'Submitted': '#1360d2', 'Cleared': '#28a745',
  'Approved': '#28a745', 'More Info Required': '#b45309', 'Rejected': '#c0392b', 'Draft': '#697498',
};

/* ── Listing rows ── */
export type SiraRow = {
  requestNo: string;
  requestType: string;
  paymentAdviceNo: string;
  importPermitNo: string;
  fromStorage: string;
  toPort: string;
  statusDateTime: string;
  requestDateTime: string;
  status: SiraStatus;
  /* extra fields surfaced in the card view / advanced search */
  productCategory: string;
  bolAwbNo: string;
  licenseNo: string;
};

const STATUS_CYCLE: SiraStatus[] = [
  'Payment Pending', 'Submitted', 'Cleared', 'More Info Required',
  'Approved', 'Payment Pending', 'Rejected', 'Submitted',
  'Draft', 'Cleared', 'Payment Pending', 'Submitted',
];

export const SIRA_ROWS: SiraRow[] = STATUS_CYCLE.map((status, i) => ({
  requestNo:       `GCP-2026-0001${(48 + i).toString().padStart(2, '0')}`,
  requestType:     REQUEST_TYPES[i % 4],
  paymentAdviceNo: `ClearancePA-2026-784${51 + i}`,
  importPermitNo:  `IMP-2026-458${24 + i}`,
  fromStorage:     STORAGES[i % STORAGES.length],
  toPort:          i % 3 === 0 ? 'Jebel Ali Port' : i % 3 === 1 ? 'Port Rashid' : 'DXB Airport',
  statusDateTime:  `8/17/2026 10:4${i % 10}`,
  requestDateTime: `8/15/2026 09:1${i % 10}`,
  status,
  productCategory: PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length],
  bolAwbNo:        `BOL13243${20 + i}`,
  licenseNo:       LICENSE_NOS[i % LICENSE_NOS.length],
}));

/* ── HS Code line items (Figma 22:14527) ── */
export type HsRow = {
  hsCode: string;
  goodsDescription: string;
  brand: string;
  model: string;
  category: string;
  purposeOfUse: string;
  valueOfGoods: string;
  grossWeight: string;
  netWeight: string;
  totalGrossWeight: string;
  countryOfOrigin: string;
  serialNumber: string;
};

export const HS_ROWS: HsRow[] = ['AX', 'BX', 'CX', 'DX', 'EX', 'FX', 'GX'].map((p, i) => ({
  hsCode: `${p}1234567`,
  goodsDescription: 'Spare parts',
  brand: 'New',
  model: 'New',
  category: 'New',
  purposeOfUse: 'India',
  valueOfGoods: '1,500',
  grossWeight: '100 kg',
  netWeight: '100 kg',
  totalGrossWeight: '100 kg',
  countryOfOrigin: 'New Zealand',
  serialNumber: `SN-000${i + 1}`,
}));

/* ── Attachments (Figma 22:17129) ── */
export const REQUIRED_DOC_OPTIONS: { label: string; required: boolean; nature: string }[] = [
  { label: 'Trade License',                 required: true,  nature: 'Copy' },
  { label: 'Performa Invocie',              required: true,  nature: 'Copy' },
  { label: 'Packing List',                  required: true,  nature: 'Copy' },
  { label: 'NOC from Ministry of Interior', required: true,  nature: 'Original' },
  { label: 'Customs Declaration',           required: false, nature: 'Copy' },
  { label: 'Other Supporting Documents',    required: false, nature: 'Any' },
];

export const DOCUMENT_ISSUERS = ['Dubai Municipality', 'SIRA', 'Dubai Customs', 'Ministry of Interior'];

export type UploadedDoc = { name: string; type: string; size: string; on: string };

export const UPLOADED_DOCS: UploadedDoc[] = [
  { name: 'Passport Copy',                             type: 'Invoice',            size: '50 MB', on: '08-12-2024' },
  { name: 'Trade License copy',                        type: 'Invoice',            size: '50 MB', on: '08-12-2024' },
  { name: 'Certificate Of Origin issued by the Ministry', type: 'Invoice',         size: '50 MB', on: '08-12-2024' },
  { name: 'Organizational Structure/Profile Copy',     type: 'AWB/BOL',            size: '50 MB', on: '08-12-2024' },
  { name: 'Invoice Consumption Request Letter',        type: 'Cert. of Origin',    size: '50 MB', on: '08-12-2024' },
  { name: 'Laboratory 123234.pdf',                     type: 'Laboratory Results', size: '50 MB', on: '08-12-2024' },
];
