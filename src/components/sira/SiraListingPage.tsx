import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import Pagination from '../Pagination';
import ManageColumnsModal, { ColDef } from '../ManageColumnsModal';
import { ColumnFilter } from '../ColumnFilter';
import StatusFilterHeader from '../StatusFilterHeader';
import { StatusAsOnBadge } from '../DatePicker';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import { font, SiraSelect, SiraDate, SiraInput } from './SiraFields';
import {
  SIRA_ROWS, SIRA_STATUSES, STATUS_STYLE, STATUS_COLORS, SEARCH_FIELDS, ROW_ACTIONS,
  REQUEST_TYPES, PRODUCT_CATEGORIES, TRANSPORTATION_METHODS, TRANSIT_VIA_TYPES,
  COUNTRIES, PORTS, DUBAI_ENTRY_PORTS, DATE_TYPES, IMPORTERS, LICENSE_NOS,
  SIRA_SERVICE_TITLE,
  type SiraRow, type SiraStatus,
} from './siraData';

type Props = {
  onClose: () => void;
  onStartJourney: () => void;
  onViewRequest?: (row: SiraRow) => void;
};

/* ── Columns (Figma 22:18635) ── */
const COL_DEFS: (ColDef & { w: number })[] = [
  { key: 'requestNo',       label: 'Request No.',           w: 180 },
  { key: 'requestType',     label: 'Request Type.',         w: 175 },
  { key: 'paymentAdviceNo', label: 'Payment Advice No.',    w: 215 },
  { key: 'importPermitNo',  label: 'Import Permit No,',     w: 190 },
  { key: 'fromStorage',     label: 'From Storage',          w: 170 },
  { key: 'toPort',          label: 'To Port',               w: 160 },
  { key: 'statusDateTime',  label: 'Status Date and Time',  w: 200 },
  { key: 'requestDateTime', label: 'Request Date and Time', w: 205 },
  { key: 'productCategory', label: 'Product Category',      w: 185 },
  { key: 'bolAwbNo',        label: 'BOL / AWB Number',      w: 185 },
  { key: 'licenseNo',       label: 'License Number',        w: 175 },
];

const DEFAULT_VISIBLE = [
  'requestNo', 'requestType', 'paymentAdviceNo', 'importPermitNo',
  'fromStorage', 'toPort', 'statusDateTime', 'requestDateTime',
];

/* Sticky block = Status (170) + Actions (90) */
const STICKY_W = 260;

/* ── Advanced filters (Figma 90:4713) ── */
type AFDef =
  | { key: string; label: string; type: 'dropdown'; options: string[]; required?: boolean }
  | { key: string; label: string; type: 'date' | 'text'; required?: boolean };

const AF_FIELDS: AFDef[] = [
  { key: 'requestType',   label: 'Request Type',         type: 'dropdown', options: REQUEST_TYPES },
  { key: 'productCat',    label: 'Product Category',     type: 'dropdown', options: PRODUCT_CATEGORIES },
  { key: 'transport',     label: 'Transportation Method',type: 'dropdown', options: TRANSPORTATION_METHODS },
  { key: 'transitVia',    label: 'Transit Via Type',     type: 'dropdown', options: TRANSIT_VIA_TYPES },
  { key: 'dateType',      label: 'Date Type',            type: 'dropdown', options: DATE_TYPES },
  { key: 'dateFrom',      label: 'Date Range from',      type: 'date', required: true },
  { key: 'dateTo',        label: 'Date Range to',        type: 'date', required: true },
  { key: 'countryLoad',   label: 'Country of Loading',   type: 'dropdown', options: COUNTRIES },
  { key: 'status',        label: 'Status',               type: 'dropdown', options: SIRA_STATUSES },
  { key: 'portLoad',      label: 'Port of Loading',      type: 'dropdown', options: PORTS },
  { key: 'entryPort',     label: 'Entry in Dubai via Port', type: 'dropdown', options: DUBAI_ENTRY_PORTS },
  { key: 'impExp1',       label: 'Importer / Exporter',  type: 'dropdown', options: IMPORTERS },
  { key: 'licenseNo',     label: 'License No.',          type: 'dropdown', options: LICENSE_NOS },
  { key: 'impExp2',       label: 'Importer / Exporter',  type: 'dropdown', options: IMPORTERS },
];

const REPORT_OPTIONS = ['Request Summary Report', 'Payment Report', 'Permit Expiry Report', 'Audit Trail'];

/* ── Reports split-button ── */
function ReportsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="h-[48px] px-[18px] flex items-center gap-[10px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
        style={{ fontFamily: font, fontWeight: 500 }}>
        Reports
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2.4"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[52px] z-[200] bg-white rounded-[8px] py-[4px]"
          style={{ minWidth: 230, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {REPORT_OPTIONS.map(o => (
            <button key={o} className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => setOpen(false)}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Row action flyout (Figma 22:19701) ── */
const ACTION_ICONS: Record<string, React.ReactNode> = {
  'View Request': (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3f4d66" strokeWidth="1.7">
      <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  'Initiate Payment': (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3f4d66" strokeWidth="1.7">
      <rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" />
    </svg>
  ),
  'More Info Required': (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3f4d66" strokeWidth="1.7">
      <rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  ),
  'Download Certificate': (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3f4d66" strokeWidth="1.7">
      <rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  ),
};

function ActionFlyout({ onPick, onClose }: { onPick: (a: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute z-[120] right-0 bg-white rounded-[10px] py-[8px] overflow-hidden"
      style={{ top: 36, width: 230, boxShadow: '0px 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
      {ROW_ACTIONS.map(label => (
        <button key={label} onClick={() => onPick(label)}
          className="w-full px-[16px] py-[11px] text-left text-[16px] text-[#111838] hover:bg-[#e2ebf9] transition-colors flex items-center gap-[12px]"
          style={{ fontFamily: font }}>
          {ACTION_ICONS[label]}
          <span className="whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Card view (Figma 103:5522) ── */
function RequestCard({ row, selected, onToggle, onAction }: {
  row: SiraRow; selected: boolean; onToggle: () => void; onAction: (a: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const st = STATUS_STYLE[row.status];
  const Cell = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-[#f6f8fc] rounded-[4px] px-[12px] py-[9px] min-w-0 flex-1">
      <span className="text-[14px] text-[#5a6478]" style={{ fontFamily: font }}>{label}: </span>
      <span className="text-[14px] text-[#0e1b3d] font-medium break-all" style={{ fontFamily: font }}>{value}</span>
    </div>
  );
  return (
    <div className="bg-white rounded-[10px] p-[16px] flex flex-col gap-[10px]"
      style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.16)' }}>
      <div className="flex items-start gap-[12px]">
        <span className="size-[48px] rounded-full bg-[#f2f6fd] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.7">
            <path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7l-5-5z" />
            <path d="M14 2v5h5M9 13h6M9 17h4" strokeLinecap="round" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input type="checkbox" checked={selected} onChange={onToggle}
              className="size-[18px] rounded-[3px] border-2 border-[#c0c6cf] cursor-pointer flex-shrink-0" />
            <span className="text-[17px] font-bold text-[#0e1b3d] truncate" style={{ fontFamily: font }}>{row.requestNo}</span>
          </label>
          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[14px] font-medium mt-[8px]"
            style={{ background: st.bg, color: st.color, fontFamily: font }}>
            {row.status}
          </span>
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => setOpen(o => !o)}
            className="size-[30px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors" aria-label="Row actions">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
              <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
            </svg>
          </button>
          {open && <ActionFlyout onPick={a => { setOpen(false); onAction(a); }} onClose={() => setOpen(false)} />}
        </div>
      </div>

      <Cell label="Request date &amp; time" value={row.requestDateTime} />
      <div className="flex gap-[10px]">
        <Cell label="Product Category" value={row.productCategory} />
        <Cell label="Request Type" value={row.requestType} />
      </div>
      <div className="flex gap-[10px]">
        <Cell label="BOL/AWB Number" value={row.bolAwbNo} />
        <Cell label="License Number" value={row.licenseNo} />
      </div>
    </div>
  );
}

export default function SiraListingPage({ onClose, onStartJourney, onViewRequest }: Props) {
  const [view, setView] = useState<'list' | 'card'>('list');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchType, setSearchType] = useState(SEARCH_FIELDS[0]);
  const [searchValue, setSearchValue] = useState('');
  const [searchDropOpen, setSearchDropOpen] = useState(false);
  const [afOpen, setAfOpen] = useState(false);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [showColModal, setShowColModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SiraStatus | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFrom, setStatusFrom] = useState('2022-12-28');
  const [statusTo, setStatusTo] = useState('2023-01-10');
  const [af, setAf] = useState<Record<string, string>>({});
  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE);

  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!searchDropOpen) return;
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [searchDropOpen]);

  const visibleHeaders = visibleCols.map(k => COL_DEFS.find(c => c.key === k)!).filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const setAfVal = (k: string, v: string) => setAf(p => ({ ...p, [k]: v }));
  const resetAf = () => setAf({});

  const filtered = SIRA_ROWS.filter(r => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (af.requestType && r.requestType !== af.requestType) return false;
    if (af.productCat && r.productCategory !== af.productCat) return false;
    if (af.status && r.status !== af.status) return false;
    if (af.licenseNo && r.licenseNo !== af.licenseNo) return false;
    if (!searchValue) return true;
    const val =
      searchType === 'Request Number' ? r.requestNo :
      searchType === 'AWB/BOL Number' ? r.bolAwbNo : r.licenseNo;
    return val.toLowerCase().includes(searchValue.toLowerCase());
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + STICKY_W;

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const handleAction = (action: string, row: SiraRow) => {
    setOpenFlyout(null);
    if (action === 'View Request') onViewRequest?.(row);
  };

  return (
    <>
      {showColModal && (
        <ManageColumnsModal
          columns={COL_DEFS}
          visible={visibleCols}
          lockedColumns={[{ key: '_status', label: 'Status' }, { key: '_action', label: 'Actions' }]}
          onSave={setVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Header onHome={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-[4px] text-[16px] mt-[16px] mb-[10px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">SIRA - Goods Control Permit</span>
          </div>

          <h1 className="text-[32px] font-bold text-[#0e1b3d] mb-[22px]" style={{ fontFamily: font }}>
            {SIRA_SERVICE_TITLE}
          </h1>

          {/* Toolbar */}
          <div className="flex items-center gap-[12px] mb-[14px] flex-wrap">
            <button
              onClick={() => setAfOpen(o => !o)}
              className={`h-[48px] w-[210px] px-[16px] flex items-center justify-between gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
                afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#0e1b3d] hover:bg-[#f0f4ff]'
              }`}
              style={{ fontFamily: font }}
            >
              Advance Filters
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Search — field dropdown + input (Figma 102:3835) */}
            <div className="flex h-[48px] rounded-[4px] border border-[#d4dcfa] bg-white relative" ref={searchRef}>
              <button
                className="flex items-center gap-[8px] px-[14px] border-r border-[#d4dcfa] select-none"
                style={{ minWidth: 150 }}
                onClick={() => setSearchDropOpen(o => !o)}
              >
                <span className="text-[16px] text-[#1360d2] whitespace-nowrap font-medium" style={{ fontFamily: font }}>{searchType}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" className={`transition-transform ${searchDropOpen ? 'rotate-180' : ''}`}>
                  <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {searchDropOpen && (
                <div className="absolute left-0 top-[52px] bg-white rounded-[10px] py-[8px] z-[200]"
                  style={{ minWidth: 230, boxShadow: '0 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
                  {SEARCH_FIELDS.map(f => (
                    <button key={f} className="w-full px-[16px] py-[11px] text-left hover:bg-[#e2ebf9] transition-colors"
                      onClick={() => { setSearchType(f); setSearchValue(''); setSearchDropOpen(false); }}>
                      <span className="text-[16px] text-[#111838]" style={{ fontFamily: font }}>{f}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center px-[14px] gap-[10px]">
                <input
                  type="text" value={searchValue} onChange={e => { setSearchValue(e.target.value); setPage(1); }}
                  placeholder={searchType}
                  className="w-[160px] text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none"
                  style={{ fontFamily: font }}
                />
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                  <circle cx="7.5" cy="7.5" r="6" stroke="#0e1b3d" strokeWidth="1.6" />
                  <path d="M12 12l5 5" stroke="#0e1b3d" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="flex-1" />

            {/* Card / list view toggle */}
            <div className="flex items-center gap-[4px] rounded-[6px] bg-[#eef1f7] p-[5px]">
              {(['card', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} aria-label={`${v} view`}
                  className="size-[38px] rounded-[6px] flex items-center justify-center transition-colors"
                  style={{ background: view === v ? '#fff' : 'transparent', boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.12)' : 'none' }}>
                  {v === 'card' ? (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill={view === v ? '#1360d2' : '#8b93a7'}>
                      <rect x="2" y="2" width="7" height="7" rx="1.5" /><rect x="11" y="2" width="7" height="7" rx="1.5" />
                      <rect x="2" y="11" width="7" height="7" rx="1.5" /><rect x="11" y="11" width="7" height="7" rx="1.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={view === v ? '#1360d2' : '#8b93a7'} strokeWidth="1.9" strokeLinecap="round">
                      <path d="M6.5 5h11M6.5 10h11M6.5 15h11" /><path d="M2.6 5h.01M2.6 10h.01M2.6 15h.01" strokeWidth="2.6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-[8px] text-[16px] text-[#1360d2] hover:opacity-80 px-[8px]"
              style={{ fontFamily: font, fontWeight: 600 }}>
              Need Help
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7">
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 14.2v-.01M8.4 7.6a1.7 1.7 0 113 1.1c-.6.5-1.4.8-1.4 1.8" strokeLinecap="round" />
              </svg>
            </button>

            <ReportsDropdown />

            <button
              onClick={onStartJourney}
              className="h-[48px] px-[30px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 700 }}
            >
              Start Journey
            </button>
          </div>

          {/* Advanced filters panel (Figma 90:4713) */}
          {afOpen && (
            <div className="relative bg-white rounded-[8px] p-[26px] pt-[40px] mb-[16px]"
              style={{ boxShadow: '4px 4px 30px rgba(0,0,0,0.12)' }}>
              <button onClick={() => setAfOpen(false)} aria-label="Close filters"
                className="absolute top-[16px] right-[20px] size-[28px] flex items-center justify-center rounded-full text-[#697498] hover:text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9.5" /><path d="M15.5 8.5l-7 7M8.5 8.5l7 7" strokeLinecap="round" />
                </svg>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[24px]">
                {AF_FIELDS.map(f => (
                  f.type === 'dropdown'
                    ? <SiraSelect key={f.key} label={f.label} value={af[f.key] ?? ''} options={f.options}
                        onChange={v => setAfVal(f.key, v)} required={f.required} />
                    : f.type === 'date'
                      ? <SiraDate key={f.key} label={f.label} value={af[f.key] ?? ''} onChange={v => setAfVal(f.key, v)} required={f.required} />
                      : <SiraInput key={f.key} label={f.label} value={af[f.key] ?? ''} onChange={v => setAfVal(f.key, v)} required={f.required} />
                ))}
                {/* Reset / Apply sit inline in the grid, right after the last field */}
                <div className="flex gap-[14px] items-center">
                  <button onClick={resetAf} data-secondary-btn
                    className="h-[56px] flex-1 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font, fontWeight: 500 }}>Reset</button>
                  <button onClick={() => { setPage(1); setAfOpen(false); }}
                    className="h-[56px] flex-1 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Apply</button>
                </div>
              </div>
            </div>
          )}

          {/* Status-as-on badge + Columns */}
          <div className="relative flex items-center justify-center mb-[16px] min-h-[52px]">
            <StatusAsOnBadge
              fromValue={statusFrom} toValue={statusTo}
              onApply={(f, t) => { setStatusFrom(f); setStatusTo(t); }}
              disabled={afOpen}
            />
            <button
              onClick={() => setShowColModal(true)}
              className="absolute right-0 h-[48px] px-[18px] flex items-center gap-[10px] rounded-[8px] border border-[#e2e8f5] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}
            >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.5">
                <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" />
                <path d="M7.5 3.5v13M12.5 3.5v13" />
              </svg>
              Columns
            </button>
          </div>

          {view === 'card' ? (
            /* ── Card view (Figma 103:5522) ── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
              {paginated.map(row => (
                <RequestCard key={row.requestNo} row={row}
                  selected={selected.has(row.requestNo)}
                  onToggle={() => toggleSelect(row.requestNo)}
                  onAction={a => handleAction(a, row)} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-center py-16 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                  No records found
                </p>
              )}
            </div>
          ) : (
            /* ── List view (Figma 22:18635) ── */
            <div style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd}
                onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STICKY_W} />
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
                    minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px',
                    fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined,
                  }}
                  className="w-full"
                >
                  <thead>
                    <tr>
                      {visibleHeaders.map((col, idx) => (
                        <th
                          key={col.key}
                          data-col-key={col.key}
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
                          onDrop={e => onDrop(col.key, e, visibleCols, setVisibleCols)}
                        >
                          <div
                            draggable
                            onDragStart={e => onDragStart(col.key, e)}
                            onDragEnd={onDragEnd}
                            style={{
                              display: hoveredColKey === col.key ? 'flex' : 'none',
                              position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                              cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                            }}
                          >
                            <DragDots visible />
                          </div>
                          <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                        </th>
                      ))}

                      {/* Sticky: Status */}
                      <th style={{
                        position: 'sticky', right: 90, width: 170, minWidth: 170,
                        background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                      }}>
                        <StatusFilterHeader
                          label="Status"
                          options={SIRA_STATUSES}
                          value={statusFilter}
                          onChange={v => { setStatusFilter(v as SiraStatus | null); setPage(1); }}
                          colorMap={STATUS_COLORS}
                        />
                      </th>

                      {/* Sticky: Actions */}
                      <th style={{
                        position: 'sticky', right: 0, width: 90, minWidth: 90,
                        background: '#a6c2e9', padding: '10px 8px', textAlign: 'center',
                        borderRadius: '0 8px 0 0', zIndex: 2,
                      }}>
                        <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.map((row, i) => {
                      const st = STATUS_STYLE[row.status];
                      return (
                        <tr key={row.requestNo}>
                          {visibleHeaders.map((col, ci) => (
                            <td
                              key={col.key}
                              data-col-key={col.key}
                              style={{
                                background: getTdBg(col.key) ?? '#fff',
                                padding: '0 8px', height: 54, verticalAlign: 'middle',
                                borderBottom: '1px solid #f0f4ff',
                                paddingLeft: ci === 0 ? 16 : 8,
                                width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span
                                className="text-[16px] whitespace-nowrap overflow-hidden text-ellipsis block"
                                style={col.key === 'requestNo'
                                  ? { color: '#1360d2', fontWeight: 500, cursor: 'pointer' }
                                  : { color: '#0e1b3d' }}
                                onClick={col.key === 'requestNo' ? () => onViewRequest?.(row) : undefined}
                              >
                                {row[col.key as keyof SiraRow]}
                              </span>
                            </td>
                          ))}

                          {/* Sticky: Status */}
                          <td style={{
                            background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff',
                            position: 'sticky', right: 90, width: 170, minWidth: 170,
                            boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                            zIndex: openFlyout === i ? 49 : 1,
                          }}>
                            <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                              style={{ background: st.bg, color: st.color, fontFamily: font }}>
                              {row.status}
                            </span>
                          </td>

                          {/* Sticky: Actions */}
                          <td style={{
                            background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                            position: 'sticky', right: 0, width: 90, minWidth: 90,
                            zIndex: openFlyout === i ? 50 : 1,
                          }}>
                            <div className="relative inline-block">
                              <button
                                onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                                aria-label="Row actions"
                                className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                                  <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                                </svg>
                              </button>
                              {openFlyout === i && (
                                <ActionFlyout onPick={a => handleAction(a, row)} onClose={() => setOpenFlyout(null)} />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={visibleHeaders.length + 2}
                          className="text-center py-16 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={n => { setPageSize(n); setPage(1); }}
          />
        </div>
      </div>
    </>
  );
}
