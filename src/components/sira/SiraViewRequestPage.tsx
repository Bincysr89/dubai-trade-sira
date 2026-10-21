import React, { useState } from 'react';
import Header from '../Header';
import Pagination from '../Pagination';
import { DhAmount } from '../Dh';
import SiraDocumentViewerModal from './SiraDocumentViewerModal';
import { font } from './SiraFields';
import {
  HS_ROWS, UPLOADED_DOCS, STATUS_STYLE,
  type HsRow, type SiraRow, type UploadedDoc,
} from './siraData';

type Props = {
  /** The listing row the user opened. */
  row: SiraRow;
  onBackToListing: () => void;
  onHome: () => void;
  serviceLabel?: string;
  /** Transport permit rows describe a route rather than a shipment. */
  transportPermit?: boolean;
};

/* ──────────────────────────────────────────────────────────────
   Shell matching the Refund & Claims "View Claim" page: section
   heading outside a bordered white card, label/value pairs in
   #455174 / #051937, hairline dividers between rows.
   ────────────────────────────────────────────────────────────── */

function FieldItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[10px] px-[4px]">
        <h2 className="text-[20px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
        {badge && (
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]"
            style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>{badge}</span>
        )}
      </div>
      <div className="bg-white rounded-[8px] overflow-hidden"
        style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
      <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f3fa' }}>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </td>
  );
}

/* Values shown for a shipment (Goods Control / Hazardous) request. */
const SHIPMENT_FIELDS = (row: SiraRow): { label: string; value: string }[][] => [
  [
    { label: 'Permit Type',             value: row.permitType },
    { label: 'Request Type',            value: row.requestType },
    { label: 'Product Category',        value: row.productCategory },
    { label: 'License Number',          value: row.licenseNo },
  ],
  [
    { label: 'Importer',                value: 'Two Seasons Hotel and Hotel Apartments' },
    { label: 'Vendor',                  value: 'Astral Aerial - Nairobi' },
    { label: 'Shipping Company',        value: 'Al Bait Al Mamoor Cargo Llc - Dubai' },
    { label: 'Transportation Method',   value: 'Sea Freight' },
  ],
  [
    { label: 'BOL / AWB',               value: row.bolAwbNo },
    { label: 'Shipping Invoice Number', value: '5665' },
    { label: 'Country of Loading',      value: 'India' },
    { label: 'Port of Loading',         value: 'Tuticorin' },
  ],
  [
    { label: 'Transit via Type',        value: 'Direct' },
    { label: 'Entry in via Dubai Port', value: 'Jebel Ali' },
    { label: 'Payment Advice No.',      value: row.paymentAdviceNo },
    { label: 'Import Permit No.',       value: row.importPermitNo },
  ],
];

/* Values shown for a transport permit request. */
const TRANSPORT_FIELDS = (row: SiraRow): { label: string; value: string }[][] => [
  [
    { label: 'Permit Type',             value: row.permitType },
    { label: 'Importer / Company name', value: 'ANBU RAJ' },
    { label: 'Transport Permit Method', value: row.requestType },
    { label: 'Product Category',        value: row.productCategory },
  ],
  [
    { label: 'From',                    value: row.fromStorage },
    { label: 'To',                      value: row.toPort },
    { label: 'Makani number',           value: '3269285283' },
    { label: 'Sending date & time',     value: row.requestDateTime },
  ],
  [
    { label: 'Shipping invoice number', value: '12545' },
    { label: 'License Number',          value: row.licenseNo },
    { label: 'Payment Advice No.',      value: row.paymentAdviceNo },
    { label: 'Import Permit No.',       value: row.importPermitNo },
  ],
];

const HS_COLS: { key: keyof HsRow; label: string }[] = [
  { key: 'hsCode',           label: 'HS Code' },
  { key: 'goodsDescription', label: 'Goods Description' },
  { key: 'brand',            label: 'Brand' },
  { key: 'model',            label: 'Model' },
  { key: 'category',         label: 'Category' },
  { key: 'purposeOfUse',     label: 'Purpose of Use' },
  { key: 'valueOfGoods',     label: 'Value of Goods' },
  { key: 'grossWeight',      label: 'Gross Weight' },
  { key: 'netWeight',        label: 'Net Weight' },
  { key: 'totalGrossWeight', label: 'Total Gross Weight' },
  { key: 'countryOfOrigin',  label: 'Country of Origin' },
  { key: 'serialNumber',     label: 'Serial Number' },
];

const DOC_COLS: { key: keyof UploadedDoc; label: string }[] = [
  { key: 'name', label: 'Document Name' },
  { key: 'type', label: 'Document Type' },
  { key: 'size', label: 'Uploaded size' },
  { key: 'on',   label: 'Uploaded on' },
];

/**
 * View Request — the whole request on one read-only page.
 * No stepper and no editing: request information, line items and documents
 * are all shown at once, and the only action is going back to the listing.
 */
export default function SiraViewRequestPage({
  row, onBackToListing, onHome,
  serviceLabel = 'SIRA - Goods Control Permit',
  transportPermit = false,
}: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [hsPage, setHsPage] = useState(1);
  const [hsPageSize, setHsPageSize] = useState(5);

  const docs = UPLOADED_DOCS;
  const items = HS_ROWS;
  const fieldRows = transportPermit ? TRANSPORT_FIELDS(row) : SHIPMENT_FIELDS(row);
  const st = STATUS_STYLE[row.status];

  const hsTotalPages = Math.max(1, Math.ceil(items.length / hsPageSize));
  const hsPaged = items.slice((hsPage - 1) * hsPageSize, hsPage * hsPageSize);

  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>

      {/* Breadcrumb + agent banner */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[20px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onHome} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <button onClick={onBackToListing} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Service Catalog</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{serviceLabel}</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-Importer -MAERSK KAKOO UAE LLC</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <div className="flex items-center gap-[14px] flex-wrap mb-[20px] mt-[4px]">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
            View Request — {row.requestNo}
          </h1>
          <span className="inline-flex items-center px-[12px] py-[3px] rounded-[4px] text-[16px] font-medium"
            style={{ background: st.bg, color: st.color, fontFamily: font }}>
            {row.status}
          </span>
          <span className="inline-flex items-center gap-[7px] px-[12px] py-[3px] rounded-[4px] text-[15px]"
            style={{ background: '#eef1f8', color: '#455174', fontFamily: font }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="2.6" />
            </svg>
            View only
          </span>
        </div>

        <div className="flex flex-col gap-[24px]">
          {/* ── Request Information ── */}
          <Section title="Request Information">
            {fieldRows.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && <Divider />}
                <div className="flex flex-wrap">
                  {group.map(f => <FieldItem key={f.label} label={f.label} value={f.value} />)}
                </div>
              </React.Fragment>
            ))}
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Request Date &amp; Time" value={row.requestDateTime} />
              <FieldItem label="Status Date &amp; Time" value={row.statusDateTime} />
            </div>
          </Section>

          {/* ── HS Code Details ── */}
          <Section title="HS Code Details" badge={`${items.length} line item${items.length !== 1 ? 's' : ''}`}>
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 1100 }}>
                <thead>
                  <tr>{HS_COLS.map(c => <Th key={c.key}>{c.label}</Th>)}</tr>
                </thead>
                <tbody>
                  {hsPaged.map((r, i) => (
                    <tr key={`${r.hsCode}-${i}`}>
                      {HS_COLS.map(c => (
                        <Td key={c.key}>
                          {c.key === 'valueOfGoods' ? <DhAmount value={r.valueOfGoods} /> : r[c.key]}
                        </Td>
                      ))}
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={HS_COLS.length} className="text-center py-10 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                        No line items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {items.length > 0 && (
              <div className="px-[16px] pb-[8px]">
                <Pagination
                  page={hsPage}
                  totalPages={hsTotalPages}
                  pageSize={hsPageSize}
                  pageSizeOptions={[5, 10, 25, 50]}
                  totalItems={items.length}
                  onPageChange={setHsPage}
                  onPageSizeChange={n => { setHsPageSize(n); setHsPage(1); }}
                />
              </div>
            )}
          </Section>

          {/* ── Uploaded Documents ── */}
          <Section title="Uploaded Documents" badge={`${docs.length} document${docs.length !== 1 ? 's' : ''}`}>
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 760 }}>
                <thead>
                  <tr>
                    {DOC_COLS.map(c => <Th key={c.key}>{c.label}</Th>)}
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d, i) => (
                    <tr key={`${d.name}-${i}`}>
                      {DOC_COLS.map(c => <Td key={c.key}>{d[c.key]}</Td>)}
                      {/* View and download only — nothing here changes the request */}
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f3fa' }}>
                        <div className="flex items-center gap-[8px]">
                          <button title="View" aria-label={`View ${d.name}`} onClick={() => setViewerIndex(i)}
                            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                            style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
                              <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" strokeLinejoin="round" />
                              <circle cx="10" cy="10" r="2.6" />
                            </svg>
                          </button>
                          <button title="Download" aria-label={`Download ${d.name}`}
                            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                            style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>

      {/* Footer — the only action is leaving the page */}
      <div className="bg-white flex items-center px-[40px] py-[16px] flex-shrink-0"
        style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
        <button onClick={onBackToListing} data-secondary-btn
          className="h-[48px] px-[36px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
          style={{ fontFamily: font, fontWeight: 500 }}>
          Back To Listing
        </button>
      </div>

      {viewerIndex !== null && docs.length > 0 && (
        <SiraDocumentViewerModal
          docs={docs}
          index={Math.min(viewerIndex, docs.length - 1)}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
