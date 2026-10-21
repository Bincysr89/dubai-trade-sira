import React, { useState } from 'react';
import Header from '../Header';
import { ColumnFilter } from '../ColumnFilter';
import { DhAmount } from '../Dh';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import SiraDocumentViewerModal from './SiraDocumentViewerModal';
import { font, SiraCard } from './SiraFields';
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

/* ── Read-only label / value pair ── */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-0" style={{ rowGap: 4 }}>
      <span className="text-[15px] text-[#8f94ae]" style={{ fontFamily: font, lineHeight: '18px' }}>{label}</span>
      <span className="text-[16px] text-[#0e1b3d]"
        style={{ fontFamily: font, fontWeight: 500, lineHeight: '22px', wordBreak: 'break-word' }}>
        {value || '—'}
      </span>
    </div>
  );
}

/* Values shown for a shipment (Goods Control / Hazardous) request. */
const SHIPMENT_FIELDS = (row: SiraRow): { label: string; value: string }[] => [
  { label: 'Permit Type',              value: row.permitType },
  { label: 'Request Type',             value: row.requestType },
  { label: 'Product Category',         value: row.productCategory },
  { label: 'Importer',                 value: 'Two Seasons Hotel and Hotel Apartments' },
  { label: 'Vendor',                   value: 'Astral Aerial - Nairobi' },
  { label: 'Shipping Company',         value: 'Al Bait Al Mamoor Cargo Llc - Dubai' },
  { label: 'Transportation Method',    value: 'Sea Freight' },
  { label: 'BOL / AWB',                value: row.bolAwbNo },
  { label: 'Shipping Invoice Number',  value: '5665' },
  { label: 'Country of Loading',       value: 'India' },
  { label: 'Port of Loading',          value: 'Tuticorin' },
  { label: 'Transit via Type',         value: 'Direct' },
  { label: 'Entry in via Dubai Port',  value: 'Jebel Ali' },
  { label: 'License Number',           value: row.licenseNo },
];

/* Values shown for a transport permit request. */
const TRANSPORT_FIELDS = (row: SiraRow): { label: string; value: string }[] => [
  { label: 'Permit Type',              value: row.permitType },
  { label: 'Importer / Company name',  value: 'ANBU RAJ' },
  { label: 'Transport Permit Method',  value: row.requestType },
  { label: 'From',                     value: row.fromStorage },
  { label: 'To',                       value: row.toPort },
  { label: 'Product Category',         value: row.productCategory },
  { label: 'Makani number',            value: '3269285283' },
  { label: 'Sending date & time',      value: row.requestDateTime },
  { label: 'Shipping invoice number',  value: '12545' },
  { label: 'License Number',           value: row.licenseNo },
];

/* ── HS code columns, same order as the request form ── */
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
  { key: 'serialNumber',     label: 'Serial Number',      w: 160 },
];

const DOC_COLS: { key: keyof UploadedDoc; label: string; w: number }[] = [
  { key: 'name', label: 'Document Name', w: 340 },
  { key: 'type', label: 'Document Type', w: 220 },
  { key: 'size', label: 'Uploaded size', w: 200 },
  { key: 'on',   label: 'Uploaded on',   w: 200 },
];
const DOC_STICKY_W = 120;

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
  const docs = UPLOADED_DOCS;
  const items = HS_ROWS;
  const fields = transportPermit ? TRANSPORT_FIELDS(row) : SHIPMENT_FIELDS(row);
  const st = STATUS_STYLE[row.status];

  const hs = useTableBehaviors();
  const dt = useTableBehaviors();

  const hsMinWidth = HS_COLS.reduce((s, c) => s + hs.getW(c.key, c.w), 0);
  const docMinWidth = DOC_COLS.reduce((s, c) => s + dt.getW(c.key, c.w), 0) + DOC_STICKY_W;

  const headerCell = (
    col: { key: string; label: string; w: number },
    idx: number,
    t: ReturnType<typeof useTableBehaviors>,
    order: string[],
    last = false,
  ) => (
    <th key={col.key} data-col-key={col.key}
      style={{
        position: 'relative',
        width: t.getW(col.key, col.w), minWidth: t.getW(col.key, col.w),
        padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
        borderRadius: idx === 0 ? '8px 0 0 0' : last ? '0 8px 0 0' : undefined,
        paddingLeft: idx === 0 ? 16 : 8,
        ...t.getThStyle(col.key),
      }}
      onDragOver={e => t.onDragOver(col.key, e)}
      onDragLeave={t.onDragLeave}
      onDrop={e => t.onDrop(col.key, e, order, () => {})}
    >
      <div draggable onDragStart={e => t.onDragStart(col.key, e)} onDragEnd={t.onDragEnd}
        style={{
          display: t.hoveredColKey === col.key ? 'flex' : 'none',
          position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
          cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
        }}>
        <DragDots visible />
      </div>
      <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
    </th>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-6">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[6px] gap-4 flex-wrap">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onHome}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBackToListing}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">{serviceLabel}</span>
          </div>
          <div className="px-[16px] py-[6px] rounded-[4px] text-[16px] text-[#0e1b3d]"
            style={{ background: '#e2ebf9', fontFamily: font }}>
            A180-Importer -MAERSK KAKOO UAE LLC
          </div>
        </div>

        {/* Title + status + view-only marker */}
        <div className="flex items-center gap-[16px] flex-wrap mb-[20px]">
          <h1 className="text-[32px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>
            {row.requestNo}
          </h1>
          <span className="inline-flex items-center px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium"
            style={{ background: st.bg, color: st.color, fontFamily: font }}>
            {row.status}
          </span>
          <span className="inline-flex items-center gap-[7px] px-[12px] py-[4px] rounded-[4px] text-[15px]"
            style={{ background: '#eef1f8', color: '#5a6478', fontFamily: font }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="2.6" />
            </svg>
            View only
          </span>
        </div>

        {/* ── Request Information ── */}
        <SiraCard title="Request Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[28px] gap-y-[24px]">
            {fields.map(f => <Field key={f.label} label={f.label} value={f.value} />)}
            <Field label="Request Date &amp; Time" value={row.requestDateTime} />
            <Field label="Status Date &amp; Time" value={row.statusDateTime} />
            <Field label="Payment Advice No." value={row.paymentAdviceNo} />
            <Field label="Import Permit No." value={row.importPermitNo} />
          </div>
        </SiraCard>

        {/* ── HS Code Details ── */}
        <SiraCard title="HS Code Details">
          <p className="text-[15px] font-medium text-[#0e1b3d] mb-[14px]" style={{ fontFamily: font }}>
            {items.length} Line items
          </p>
          <div style={{ position: 'relative' }}>
            <ScrollArrows atStart={hs.atScrollStart} atEnd={hs.atScrollEnd}
              onLeft={hs.scrollToStart} onRight={hs.scrollToEnd} stickyWidth={0} />
            <div ref={hs.scrollRef} onScroll={hs.handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
              {hs.resizeIndicatorLeft !== null && (
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: hs.resizeIndicatorLeft, width: 3,
                  background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
              )}
              <table
                ref={hs.tableRef}
                onMouseMove={hs.handleTableMouseMove}
                onMouseLeave={hs.handleTableMouseLeave}
                onMouseDown={hs.handleTableMouseDown}
                style={{
                  minWidth: hsMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px',
                  fontFamily: font, cursor: hs.isNearResize ? 'col-resize' : undefined,
                }}
                className="w-full"
              >
                <thead>
                  <tr>
                    {HS_COLS.map((col, idx) =>
                      headerCell(col, idx, hs, HS_COLS.map(c => c.key), idx === HS_COLS.length - 1))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, i) => (
                    <tr key={`${r.hsCode}-${i}`}>
                      {HS_COLS.map((col, ci) => (
                        <td key={col.key} data-col-key={col.key}
                          style={{
                            background: hs.getTdBg(col.key) ?? '#fff',
                            padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff',
                            paddingLeft: ci === 0 ? 16 : 8,
                            width: hs.getW(col.key, col.w), minWidth: hs.getW(col.key, col.w),
                            whiteSpace: 'nowrap',
                          }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">
                            {col.key === 'valueOfGoods' ? <DhAmount value={r.valueOfGoods} /> : r[col.key]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SiraCard>

        {/* ── Documents Uploaded ── */}
        <SiraCard title="Documents Uploaded">
          <div style={{ position: 'relative' }}>
            <ScrollArrows atStart={dt.atScrollStart} atEnd={dt.atScrollEnd}
              onLeft={dt.scrollToStart} onRight={dt.scrollToEnd} stickyWidth={DOC_STICKY_W} />
            <div ref={dt.scrollRef} onScroll={dt.handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
              {dt.resizeIndicatorLeft !== null && (
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: dt.resizeIndicatorLeft, width: 3,
                  background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
              )}
              <table
                ref={dt.tableRef}
                onMouseMove={dt.handleTableMouseMove}
                onMouseLeave={dt.handleTableMouseLeave}
                onMouseDown={dt.handleTableMouseDown}
                style={{
                  minWidth: docMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px',
                  fontFamily: font, cursor: dt.isNearResize ? 'col-resize' : undefined,
                }}
                className="w-full"
              >
                <thead>
                  <tr>
                    {DOC_COLS.map((col, idx) => headerCell(col, idx, dt, DOC_COLS.map(c => c.key)))}
                    <th style={{
                      position: 'sticky', right: 0, width: DOC_STICKY_W, minWidth: DOC_STICKY_W,
                      background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                      boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderRadius: '0 8px 0 0', zIndex: 2,
                    }}>
                      <span className="text-[16px] font-medium text-[#051937]">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d, i) => (
                    <tr key={`${d.name}-${i}`}>
                      {DOC_COLS.map((col, ci) => (
                        <td key={col.key} data-col-key={col.key}
                          style={{
                            background: dt.getTdBg(col.key) ?? '#fff',
                            padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff',
                            paddingLeft: ci === 0 ? 16 : 8,
                            width: dt.getW(col.key, col.w), minWidth: dt.getW(col.key, col.w),
                            whiteSpace: 'nowrap',
                          }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">
                            {d[col.key]}
                          </span>
                        </td>
                      ))}
                      {/* View and download only — nothing here changes the request */}
                      <td style={{
                        background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                        borderBottom: '1px solid #f0f4ff',
                        position: 'sticky', right: 0, width: DOC_STICKY_W, minWidth: DOC_STICKY_W,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                      }}>
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
          </div>
        </SiraCard>
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
