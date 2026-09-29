import React, { useState } from 'react';
import Header from '../Header';
import { ColumnFilter } from '../ColumnFilter';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import SiraDocumentViewerModal from './SiraDocumentViewerModal';
import { font, SiraCard, SiraStepper, SiraFooter, SiraSelect, SiraInput, SiraDate } from './SiraFields';
import { SIRA_STEPS } from './SiraRequestDetailsPage';
import {
  REQUIRED_DOC_OPTIONS, DOCUMENT_ISSUERS, UPLOADED_DOCS, requestTitleFor, type UploadedDoc,
} from './siraData';

type Props = {
  /** Chosen on the Request Details step — drives the page title. */
  productCategory: string;
  onBack: () => void;
  onHome: () => void;
  onPaid: () => void;
  onPayLater: () => void;
};

const PAYMENT_ADVICE_NO = 'PA_378599';

/* ═══════════════════════════════════════════════════════════════
   Confirmation — declaration popup (Figma 303:11601)
   ═══════════════════════════════════════════════════════════════ */
function ConfirmationModal({ onAgree, onClose }: { onAgree: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4" style={{ background: 'rgba(40,42,48,0.86)' }}>
      <div className="bg-white rounded-[6px] w-full max-w-[512px] relative px-[24px] pt-[34px] pb-[26px]"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-[18px] right-[20px] text-[#3f4d66] hover:opacity-60">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex justify-center mb-[20px]">
          <span className="size-[66px] rounded-full flex items-center justify-center" style={{ background: 'rgba(250,196,62,0.32)' }}>
            <span className="size-[46px] rounded-full flex items-center justify-center" style={{ background: '#fac43e' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="9.5" /><path d="M12 8h.01M12 11v5.5" strokeLinecap="round" />
              </svg>
            </span>
          </span>
        </div>

        <h2 className="text-[20px] font-bold text-[#0e1b3d] text-center mb-[10px]" style={{ fontFamily: font }}>
          Confirmation
        </h2>
        <p className="text-[16px] text-[#5a6478] text-center leading-[25px] mb-[26px] px-[10px]" style={{ fontFamily: font }}>
          I Hereby declare that the information given in this application is true and correct to the best of my knowledge
          and belief. In case any information given in this application proves to be false or incorrect, I shall be
          responsible for the consequences.
        </p>

        <div className="flex gap-[22px]">
          <button onClick={onAgree}
            className="flex-1 h-[44px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
            Agree
          </button>
          <button onClick={onClose} data-secondary-btn
            className="flex-1 h-[44px] rounded-[4px] border border-[#dc3545] text-[16px] text-[#dc3545] bg-white hover:bg-[#fdf1f2] transition-colors"
            style={{ fontFamily: font, fontWeight: 500 }}>
            Disagree
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Payment advice generated popup (Figma 303:11729)
   ═══════════════════════════════════════════════════════════════ */
function PaymentAdviceModal({ onPayNow, onPayLater, onClose }: {
  onPayNow: () => void; onPayLater: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4" style={{ background: 'rgba(40,42,48,0.86)' }}>
      <div className="bg-white rounded-[6px] w-full max-w-[512px] relative px-[24px] pt-[34px] pb-[26px]"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-[18px] right-[20px] text-[#3f4d66] hover:opacity-60">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex justify-center mb-[20px]">
          <span className="size-[66px] rounded-full flex items-center justify-center" style={{ background: 'rgba(40,167,69,0.28)' }}>
            <span className="size-[46px] rounded-full flex items-center justify-center" style={{ background: '#16a34a' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.6">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </div>

        <h2 className="text-[19px] font-bold text-[#0e1b3d] text-center mb-[10px]" style={{ fontFamily: font }}>
          Payment advice successfully generated
        </h2>
        <p className="text-[16px] text-[#5a6478] text-center leading-[25px] px-[10px]" style={{ fontFamily: font }}>
          Payment advice generated successfully for your request. Do you want to proceed?
        </p>
        <p className="text-[17px] text-center font-medium mt-[10px] mb-[26px]"
          style={{ fontFamily: font, color: '#1360d2' }}>
          {PAYMENT_ADVICE_NO}
        </p>

        <div className="flex gap-[22px]">
          <button onClick={onPayNow}
            className="flex-1 h-[44px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
            Pay Now
          </button>
          <button onClick={onPayLater} data-secondary-btn
            className="flex-1 h-[44px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font, fontWeight: 500 }}>
            Pay Later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Attachments step (Figma 22:17129)
   ═══════════════════════════════════════════════════════════════ */
const DOC_COLS: { key: keyof UploadedDoc; label: string; w: number }[] = [
  { key: 'name', label: 'Document Name', w: 340 },
  { key: 'type', label: 'Document Type', w: 220 },
  { key: 'size', label: 'Uploaded size', w: 200 },
  { key: 'on',   label: 'Uploaded on',   w: 200 },
];
/* Sticky Action column — same width convention as the listing tables. */
const DOC_STICKY_W = 170;

/* Square outlined action buttons, matching the Refund & Claims document table. */
function DocActionButton({ title, onClick, tone = 'blue', children }: {
  title: string; onClick: () => void; tone?: 'blue' | 'red'; children: React.ReactNode;
}) {
  const blue = tone === 'blue';
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] transition-colors ${blue ? 'hover:bg-[#e8f0ff]' : 'hover:bg-[#fef2f2]'}`}
      style={{ border: `1px solid ${blue ? '#d5ddfb' : '#f3d0d3'}`, color: blue ? '#1360d2' : '#dc3545' }}
    >
      {children}
    </button>
  );
}

export default function SiraAttachmentsPage({ productCategory, onBack, onHome, onPaid, onPayLater }: Props) {
  const [docType, setDocType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [docs, setDocs] = useState<UploadedDoc[]>(UPLOADED_DOCS);
  const [dragOver, setDragOver] = useState(false);
  /* Document preview — index of the document open in the viewer, null when closed. */
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [docColOrder, setDocColOrder] = useState<string[]>(DOC_COLS.map(c => c.key));

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const orderedDocCols = docColOrder.map(k => DOC_COLS.find(c => c.key === k)!).filter(Boolean);
  const docTableMinWidth = orderedDocCols.reduce((sum, c) => sum + getW(c.key, c.w), 0) + DOC_STICKY_W;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adviceOpen, setAdviceOpen] = useState(false);

  const supportingSelected = docType === 'Other Supporting Documents';

  const addFile = () => setDocs(p => [
    ...p,
    { name: `${docType || 'Document'} ${p.length + 1}.pdf`, type: docType || 'Invoice', size: '50 MB', on: '08-12-2024' },
  ]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-6">
        <div className="flex items-center justify-between mt-[16px] mb-[6px] gap-4 flex-wrap">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onHome}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBack}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">SIRA - Goods Control Permit</span>
          </div>
          <div className="px-[16px] py-[6px] rounded-[4px] text-[16px] text-[#0e1b3d]"
            style={{ background: '#e2ebf9', fontFamily: font }}>
            A180-Importer -MAERSK KAKOO UAE LLC
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-[#0e1b3d] mb-[18px]" style={{ fontFamily: font }}>
          {requestTitleFor(productCategory)}
        </h1>

        <SiraStepper steps={SIRA_STEPS} current={1} />

        {/* ── Upload Documents — same layout as the Refund & Claims document step ── */}
        <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch mb-[20px]">

          {/* Left card — document type + its fields */}
          <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
            style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

            <div className="flex flex-col gap-[4px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Documents</p>
              <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                Choose the document type and upload the supporting file.
              </p>
            </div>

            {/* Document type — one selection */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                Select Document Type <span style={{ color: '#697498', fontWeight: 400 }}>(select one)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[8px]">
                {REQUIRED_DOC_OPTIONS.map(doc => {
                  const active = docType === doc.label;
                  const uploaded = docs.filter(u => u.type === doc.label).length;
                  return (
                    <label
                      key={doc.label}
                      className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                      style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}
                    >
                      <span className="size-[17px] rounded-full flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                        style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                        {active && <span className="size-[9px] rounded-full" style={{ background: '#1360d2' }} />}
                      </span>
                      <input type="radio" name="doc-type" className="sr-only" value={doc.label}
                        checked={active} onChange={() => setDocType(doc.label)} />
                      <div className="flex items-center flex-wrap gap-[5px] flex-1 min-w-0">
                        <span className="text-[16px] leading-snug" style={{ fontFamily: font, color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                          {doc.required && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}
                          {doc.label}
                        </span>
                        <span className="text-[14px] px-[6px] py-[1px] rounded-[4px]"
                          style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {doc.nature}
                        </span>
                      </div>
                      {uploaded > 0 && (
                        <span className="text-[11px] px-[6px] py-[1px] rounded-[10px] flex-shrink-0"
                          style={{ background: 'rgba(26,172,114,0.12)', color: '#1aac72', fontWeight: 600 }}>
                          {uploaded}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Document details — only once a type is chosen */}
            {docType ? (
              <div className="flex flex-col gap-[20px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                  <SiraSelect label="Document Issued by" value={issuedBy} options={DOCUMENT_ISSUERS} onChange={setIssuedBy} />
                  <SiraInput  label="Trade License Number" value={licenseNumber} onChange={setLicenseNumber} />
                  <SiraDate   label="Issue Date"  value={issueDate}  onChange={setIssueDate} required />
                  <SiraDate   label="Expiry Date" value={expiryDate} onChange={setExpiryDate} required />
                </div>

                {/* Remarks apply only to supporting documents */}
                {supportingSelected && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                      Remarks <span style={{ color: '#697498', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <textarea
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Enter remarks for this document…"
                      rows={3}
                      className="w-full rounded-[4px] text-[16px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[12px] py-[10px] resize-y focus:outline-none focus:border-[#1360d2] transition-colors"
                      style={{ border: '1px solid #d5ddfb', fontFamily: font, lineHeight: '22px' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[16px] text-[#b0b8d0]" style={{ fontFamily: font }}>
                Select a document type to enter its details.
              </p>
            )}
          </div>

          {/* Right card — file uploader */}
          <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
            style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

            <div className="flex flex-col gap-[4px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Upload File</p>
              <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                * Supported file types: .pdf, .jpg, .png, .txt — max file size up to 50 MB
              </p>
            </div>

            {!docType && (
              <p className="text-[16px] text-[#b45309] px-[12px] py-[8px] rounded-[4px]"
                style={{ background: '#fff8e6', border: '1px solid #f5d67a', fontFamily: font }}>
                Select a document type to upload
              </p>
            )}

            <div
              onDragOver={e => { e.preventDefault(); if (docType) setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); if (docType) addFile(); }}
              className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors flex-1"
              style={{
                border: `1.5px dashed ${dragOver ? '#1360d2' : '#b5c8e8'}`,
                background: dragOver ? '#edf3ff' : '#f8fafd',
                cursor: docType ? 'default' : 'not-allowed',
                opacity: docType ? 1 : 0.6,
              }}
            >
              <div className="size-[56px] rounded-full inline-flex items-center justify-center"
                style={{ background: dragOver ? '#d8e8ff' : '#e2ebf9' }}>
                <svg viewBox="0 0 24 24" width="26" height="24" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-[16px] text-[#697498] text-center" style={{ fontFamily: font, lineHeight: 1.5 }}>Drag and drop or</p>
              <button type="button" disabled={!docType} onClick={addFile}
                className="h-[40px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff', cursor: docType ? 'pointer' : 'not-allowed' }}>
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* ── Documents Uploaded ── */}
        <SiraCard title="Documents Uploaded">
          <div style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd}
              onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={DOC_STICKY_W} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
              {resizeIndicatorLeft !== null && (
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3,
                  background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
              )}
              <table
                ref={tableRef}
                onMouseMove={handleTableMouseMove}
                onMouseLeave={handleTableMouseLeave}
                onMouseDown={handleTableMouseDown}
                style={{
                  minWidth: docTableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px',
                  fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined,
                }}
                className="w-full"
              >
                <thead>
                  <tr>
                    {orderedDocCols.map((col, idx) => (
                      <th key={col.key} data-col-key={col.key}
                        style={{
                          position: 'relative',
                          width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                          padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
                          borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
                          paddingLeft: idx === 0 ? 16 : 8,
                          ...getThStyle(col.key),
                        }}
                        onDragOver={e => onDragOver(col.key, e)}
                        onDragLeave={onDragLeave}
                        onDrop={e => onDrop(col.key, e, docColOrder, setDocColOrder)}
                      >
                        <div draggable onDragStart={e => onDragStart(col.key, e)} onDragEnd={onDragEnd}
                          style={{
                            display: hoveredColKey === col.key ? 'flex' : 'none',
                            position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                            cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                          }}>
                          <DragDots visible />
                        </div>
                        <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                      </th>
                    ))}
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
                      {orderedDocCols.map((col, ci) => (
                        <td key={col.key} data-col-key={col.key}
                          style={{
                            background: getTdBg(col.key) ?? '#fff',
                            padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff',
                            paddingLeft: ci === 0 ? 16 : 8,
                            width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                            whiteSpace: 'nowrap',
                          }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">
                            {d[col.key]}
                          </span>
                        </td>
                      ))}
                      <td style={{
                        background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                        borderBottom: '1px solid #f0f4ff',
                        position: 'sticky', right: 0, width: DOC_STICKY_W, minWidth: DOC_STICKY_W,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                      }}>
                        <div className="flex items-center gap-[8px]">
                          <DocActionButton title="View" onClick={() => setViewerIndex(i)}>
                            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
                              <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" strokeLinejoin="round" />
                              <circle cx="10" cy="10" r="2.6" />
                            </svg>
                          </DocActionButton>
                          <DocActionButton title="Download" onClick={() => {}}>
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                            </svg>
                          </DocActionButton>
                          <DocActionButton title="Delete" tone="red"
                            onClick={() => { setDocs(p => p.filter((_, idx) => idx !== i)); setViewerIndex(null); }}>
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                            </svg>
                          </DocActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {docs.length === 0 && (
                    <tr>
                      <td colSpan={orderedDocCols.length + 1}
                        className="text-center py-12 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                        No documents uploaded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SiraCard>
      </div>

      <SiraFooter onBack={onBack} primaryLabel="Submit" onPrimary={() => setConfirmOpen(true)} />

      {confirmOpen && (
        <ConfirmationModal
          onClose={() => setConfirmOpen(false)}
          onAgree={() => { setConfirmOpen(false); setAdviceOpen(true); }}
        />
      )}
      {viewerIndex !== null && docs.length > 0 && (
        <SiraDocumentViewerModal
          docs={docs}
          index={Math.min(viewerIndex, docs.length - 1)}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
      {adviceOpen && (
        <PaymentAdviceModal
          onClose={() => setAdviceOpen(false)}
          onPayNow={() => { setAdviceOpen(false); onPaid(); }}
          onPayLater={() => { setAdviceOpen(false); onPayLater(); }}
        />
      )}
    </div>
  );
}
