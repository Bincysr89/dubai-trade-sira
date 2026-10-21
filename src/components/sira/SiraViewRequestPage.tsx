import React, { useState } from 'react';
import Header from '../Header';
import Pagination from '../Pagination';
import { useTableBehaviors, ScrollArrows } from '../../hooks/useTableBehaviors';
import { DhAmount } from '../Dh';
import SiraDocumentViewerModal from './SiraDocumentViewerModal';
import feedIconSrc from '../../assets/icon-request-feed.svg';
import shareIconSrc from '../../assets/icon-share.svg';
import printIconSrc from '../../assets/icon-print.svg';
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
  /** Leaves the read-only view for the editable request flow. */
  onAmend?: () => void;
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

/* ──────────────────────────────────────────────────────────────
   Request summary bar (Figma 1981:28178) — icon, application
   number, status chip, and the share / print / amend actions.
   ────────────────────────────────────────────────────────────── */
function SummaryBar({ requestNo, status, statusStyle, onAmend }: {
  requestNo: string;
  status: string;
  statusStyle: { bg: string; color: string };
  onAmend?: () => void;
}) {
  const iconBtn = 'h-[48px] w-[32px] rounded-[4px] bg-white flex items-center justify-center flex-shrink-0 hover:bg-[#f0f4ff] transition-colors';
  return (
    <div className="bg-white rounded-[8px] p-[20px] flex items-center justify-between gap-[20px] flex-wrap"
      style={{ filter: 'drop-shadow(0px 1px 4px rgba(0,0,0,0.04))' }}>
      <div className="flex gap-[17px] items-center">
        <div className="flex gap-[17px] items-center">
          <div className="bg-white border border-[#d5ddfb] flex items-center p-[14px] rounded-[999px] flex-shrink-0">
            <img src={feedIconSrc} alt="" width={32} height={32} />
          </div>
          <div className="flex flex-col gap-[8px] items-start" style={{ lineHeight: '20px' }}>
            <span className="text-[16px]" style={{ color: '#696f83', fontFamily: font, lineHeight: '20px' }}>
              Application Number
            </span>
            <span className="text-[20px]" style={{ color: '#111838', fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>
              {requestNo}
            </span>
          </div>
        </div>
        <span className="h-[24px] px-[12px] py-[4px] rounded-[4px] inline-flex items-center justify-center text-[14px] whitespace-nowrap"
          style={{ background: statusStyle.bg, color: statusStyle.color, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>
          {status}
        </span>
      </div>

      <div className="flex gap-[20px] items-center justify-end">
        <button type="button" title="Share" aria-label="Share request" className={iconBtn}>
          <img src={shareIconSrc} alt="" width={24} height={24} />
        </button>
        <button type="button" title="Print" aria-label="Print request" className={iconBtn}>
          <img src={printIconSrc} alt="" width={24} height={24} />
        </button>
        <button type="button" onClick={onAmend}
          className="bg-[#1360d2] h-[48px] w-[168px] rounded-[4px] flex items-center justify-center text-white text-[16px] capitalize hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ fontFamily: font, fontWeight: 500 }}>
          Amend
        </button>
      </div>
    </div>
  );
}

/* `sticky` pins the cell to the right edge so it stays put while the rest
   of the row scrolls — the same affordance the listing tables use. */
const stickyCell = (width: number): React.CSSProperties => ({
  position: 'sticky', right: 0, width, minWidth: width,
  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
});

function Th({ children, width, sticky }: { children: React.ReactNode; width?: number; sticky?: boolean }) {
  return (
    <th style={{
      background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5',
      ...(width ? { width, minWidth: width } : null),
      ...(sticky && width ? stickyCell(width) : null),
    }}>
      <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </th>
  );
}

function Td({ children, width, sticky }: { children: React.ReactNode; width?: number; sticky?: boolean }) {
  return (
    <td style={{
      padding: '10px 14px', borderBottom: '1px solid #f0f3fa',
      ...(width ? { width, minWidth: width } : null),
      ...(sticky && width ? { ...stickyCell(width), background: '#fff', zIndex: 1 } : null),
    }}>
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

/* Everything up to Serial Number scrolls; Serial Number stays pinned. */
const HS_COLS: { key: keyof HsRow; label: string; w: number }[] = [
  { key: 'hsCode',           label: 'HS Code',            w: 150 },
  { key: 'goodsDescription', label: 'Goods Description',  w: 190 },
  { key: 'brand',            label: 'Brand',              w: 125 },
  { key: 'model',            label: 'Model',              w: 125 },
  { key: 'category',         label: 'Category',           w: 140 },
  { key: 'purposeOfUse',     label: 'Purpose of Use',     w: 165 },
  { key: 'valueOfGoods',     label: 'Value of Goods',     w: 165 },
  { key: 'grossWeight',      label: 'Gross Weight',       w: 155 },
  { key: 'netWeight',        label: 'Net Weight',         w: 150 },
  { key: 'totalGrossWeight', label: 'Total Gross Weight', w: 190 },
  { key: 'countryOfOrigin',  label: 'Country of Origin',  w: 180 },
];
const HS_SERIAL_COL = { key: 'serialNumber' as const, label: 'Serial Number', w: 170 };
const HS_MIN_WIDTH = HS_COLS.reduce((sum, c) => sum + c.w, 0) + HS_SERIAL_COL.w;

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
  onAmend,
}: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const hsTable = useTableBehaviors();
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
            View Request
          </h1>
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
          <SummaryBar requestNo={row.requestNo} status={row.status} statusStyle={st} onAmend={onAmend} />

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
            {/* Serial Number stays pinned to the right while the other columns
                scroll, with the same arrows the listing tables use. */}
            <div className="px-[16px] py-[12px]" style={{ position: 'relative' }}>
              <ScrollArrows
                atStart={hsTable.atScrollStart} atEnd={hsTable.atScrollEnd}
                onLeft={hsTable.scrollToStart} onRight={hsTable.scrollToEnd}
                stickyWidth={HS_SERIAL_COL.w}
              />
              <div ref={hsTable.scrollRef} onScroll={hsTable.handleScroll} className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: HS_MIN_WIDTH }}>
                  <thead>
                    <tr>
                      {HS_COLS.map(c => <Th key={c.key} width={c.w}>{c.label}</Th>)}
                      <Th width={HS_SERIAL_COL.w} sticky>{HS_SERIAL_COL.label}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {hsPaged.map((r, i) => (
                      <tr key={`${r.hsCode}-${i}`}>
                        {HS_COLS.map(c => (
                          <Td key={c.key} width={c.w}>
                            {c.key === 'valueOfGoods' ? <DhAmount value={r.valueOfGoods} /> : r[c.key]}
                          </Td>
                        ))}
                        <Td width={HS_SERIAL_COL.w} sticky>{r.serialNumber}</Td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={HS_COLS.length + 1} className="text-center py-10 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                          No line items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
