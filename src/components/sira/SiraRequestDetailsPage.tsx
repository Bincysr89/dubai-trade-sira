import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import { ColumnFilter } from '../ColumnFilter';
import { DhAmount } from '../Dh';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import { font, SiraCard, SiraStepper, SiraFooter, SiraSelect, SiraInput, SiraValueUnit } from './SiraFields';
import {
  REQUEST_TYPES, PRODUCT_CATEGORIES, TRANSPORTATION_METHODS, TRANSIT_VIA_TYPES,
  COUNTRIES, PORTS, DUBAI_ENTRY_PORTS, IMPORTERS, WEIGHT_UNITS,
  HS_BRANDS, HS_MODELS, HS_CATEGORIES, HS_PURPOSES,
  HS_ROWS, requestTitleFor, type HsRow,
} from './siraData';
import type { JourneyValues } from './SiraJourneyPage';

export const SIRA_STEPS = ['Request Details', 'Attachments', 'Pay & Submit'];

type Props = {
  journey: JourneyValues;
  onBack: () => void;
  onHome: () => void;
  onNext: (productCategory: string) => void;
};

type Leg = { country: string; port: string };

/* ── HS Code table columns (Figma 22:14527) ── */
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
];
const HS_STICKY_W = 110;
/* Leading selection column. */
const HS_CHECK_W = 52;

const EMPTY_ITEM: HsRow = {
  hsCode: '', goodsDescription: '', brand: '', model: '', category: '', purposeOfUse: '',
  valueOfGoods: '', grossWeight: '', netWeight: '', totalGrossWeight: '',
  countryOfOrigin: '', serialNumber: '',
};

/* ═══════════════════════════════════════════════════════════════
   Add New Items — inline accordion above the HS code table
   (form content per Figma 22:15842)
   ═══════════════════════════════════════════════════════════════ */
function AddItemPanel({ initial, editing, onClose, onSave }: {
  initial?: HsRow; editing: boolean; onClose: () => void; onSave: (r: HsRow) => void;
}) {
  const blank = initial ?? { ...EMPTY_ITEM };
  const [v, setV] = useState<HsRow>(blank);
  const [grossUnit, setGrossUnit] = useState('KG');
  const [netUnit, setNetUnit] = useState('KG');
  const [totalUnit, setTotalUnit] = useState('KG');
  const set = (k: keyof HsRow, val: string) => setV(p => ({ ...p, [k]: val }));
  const reset = () => {
    setV(initial ?? { ...EMPTY_ITEM });
    setGrossUnit('KG'); setNetUnit('KG'); setTotalUnit('KG');
  };

  /* HS code description hint appears once a code is entered */
  const hsHint = v.hsCode
    ? 'Leguminous vegetables, shelled or unshelled, fresh or chilled, excluding peas & beans'
    : '';

  const stripUnit = (val: string) => val.replace(/\s*(kg|ton|lbs|g)$/i, '');

  return (
    <div className="rounded-[8px] overflow-hidden mb-[22px]" style={{ border: '1px solid #d5ddfb' }}>
      <div className="px-[20px] py-[14px] flex items-center justify-between" style={{ background: '#f2f6fd', borderBottom: '1px solid #d5ddfb' }}>
        <h3 className="text-[18px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>
          {editing ? 'Edit Item' : 'Add New Items'}
        </h3>
        <button onClick={onClose} aria-label="Close"
          className="size-[28px] rounded-full flex items-center justify-center text-[#5a6478] hover:text-[#0e1b3d] hover:bg-white transition-colors">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="bg-white p-[24px]">
        {/* Every field shares one 4-column grid so widths stay equal;
            only Goods Description is wider. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[26px]">
          <SiraInput label="HS Code" value={v.hsCode} onChange={val => set('hsCode', val)} required
            suffix={
              <svg viewBox="0 0 18 18" width="20" height="20" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="#0e1b3d" strokeWidth="1.6" />
                <path d="M12 12l5 5" stroke="#0e1b3d" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            } />
          <div className="lg:col-span-3 sm:col-span-1">
            <SiraInput label="Goods Description" value={v.goodsDescription} onChange={val => set('goodsDescription', val)} required />
          </div>

          {hsHint && (
            <p className="sm:col-span-2 lg:col-span-4 -mt-[14px] px-[12px] py-[8px] rounded-[4px] text-[15px] text-[#0e1b3d]"
              style={{ background: '#dfeaff', fontFamily: font }}>
              {hsHint}
            </p>
          )}

          <SiraSelect label="Brand"          value={v.brand}        options={HS_BRANDS}     onChange={val => set('brand', val)} required />
          <SiraSelect label="Model"          value={v.model}        options={HS_MODELS}     onChange={val => set('model', val)} required />
          <SiraSelect label="Category"       value={v.category}     options={HS_CATEGORIES} onChange={val => set('category', val)} required />
          <SiraSelect label="Purpose of Use" value={v.purposeOfUse} options={HS_PURPOSES}   onChange={val => set('purposeOfUse', val)} required />

          <SiraInput label="Value of Goods" value={v.valueOfGoods} onChange={val => set('valueOfGoods', val)} required />
          <SiraValueUnit label="Gross Weight" value={v.grossWeight} onChange={val => set('grossWeight', val)}
            unit={grossUnit} onUnitChange={setGrossUnit} units={WEIGHT_UNITS} required />
          <SiraValueUnit label="Net Weight" value={v.netWeight} onChange={val => set('netWeight', val)}
            unit={netUnit} onUnitChange={setNetUnit} units={WEIGHT_UNITS} required />
          <SiraValueUnit label="Total Gross Weight" value={v.totalGrossWeight} onChange={val => set('totalGrossWeight', val)}
            unit={totalUnit} onUnitChange={setTotalUnit} units={WEIGHT_UNITS} required />

          <SiraSelect label="Country of Origin" value={v.countryOfOrigin} options={COUNTRIES} onChange={val => set('countryOfOrigin', val)} required />
          <SiraInput label="Serial Number" value={v.serialNumber} onChange={val => set('serialNumber', val)} required />

          {/* Reset / Save sit inline in the grid, right after the Serial Number field */}
          <div className="flex gap-[14px] items-center">
            <button onClick={reset} data-secondary-btn
              className="h-[56px] flex-1 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}>Reset</button>
            <button
              onClick={() => onSave({
                ...v,
                grossWeight: v.grossWeight ? `${stripUnit(v.grossWeight)} ${grossUnit.toLowerCase()}` : '',
                netWeight: v.netWeight ? `${stripUnit(v.netWeight)} ${netUnit.toLowerCase()}` : '',
                totalGrossWeight: v.totalGrossWeight ? `${stripUnit(v.totalGrossWeight)} ${totalUnit.toLowerCase()}` : '',
              })}
              className="h-[56px] flex-1 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Transit route editor — Country / Port legs (Figma 90:7404)
   ═══════════════════════════════════════════════════════════════ */
function TransitRouteModal({ legs, onClose, onSave }: {
  legs: Leg[]; onClose: () => void; onSave: (l: Leg[]) => void;
}) {
  const [rows, setRows] = useState<Leg[]>(legs.length ? legs : [{ country: '', port: '' }, { country: '', port: '' }]);
  const set = (i: number, k: keyof Leg, v: string) =>
    setRows(p => p.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4" style={{ background: 'rgba(40,42,48,0.75)' }}>
      <div className="bg-white rounded-[8px] w-full max-w-[782px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div className="bg-[#0b1738] px-[30px] py-[20px] flex items-center justify-between flex-shrink-0">
          <h2 className="text-white text-[20px] font-bold" style={{ fontFamily: font }}>Add New Items</h2>
          <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-[30px] overflow-y-auto">
          <div className="flex flex-col gap-[26px]">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-[20px]">
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                  <SiraSelect label="Country" value={r.country} options={COUNTRIES} onChange={v => set(i, 'country', v)} required />
                  <SiraSelect label="Port"    value={r.port}    options={PORTS}     onChange={v => set(i, 'port', v)} required />
                </div>
                <button
                  onClick={() => setRows(p => p.filter((_, idx) => idx !== i))}
                  aria-label="Remove route"
                  className="size-[46px] rounded-[4px] border border-[#dc3545] flex items-center justify-center flex-shrink-0 hover:bg-[#fdf1f2] transition-colors"
                  style={{ visibility: i === 0 ? 'hidden' : 'visible' }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="1.7">
                    <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-[16px] mt-[34px]">
            <button onClick={() => setRows(p => [...p, { country: '', port: '' }])} data-secondary-btn
              className="h-[48px] px-[22px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}>Add New Route</button>
            <button onClick={() => onSave(rows.filter(r => r.country || r.port))}
              className="h-[48px] px-[34px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Request Details step
   ═══════════════════════════════════════════════════════════════ */
export default function SiraRequestDetailsPage({ journey, onBack, onHome, onNext }: Props) {
  const [requestType, setRequestType] = useState(journey.requestType);
  const [productCategory, setProductCategory] = useState(journey.productCategory || 'Hazardous Goods');
  const [importer, setImporter] = useState(IMPORTERS[0]);
  const [vendor, setVendor] = useState('Astral Aerial - Nairobi');
  const [shippingCompany, setShippingCompany] = useState('Al Bait Al Mamoor Cargo Llc - Dubai');
  const [transportation, setTransportation] = useState(journey.transportationMethod);
  const [bol, setBol] = useState(journey.bolAwbNumber || 'BOL1324324');
  const [invoiceNo, setInvoiceNo] = useState('5665');
  const [countryLoading, setCountryLoading] = useState('India');
  const [portLoading, setPortLoading] = useState('Tuticorin');
  const [transitType, setTransitType] = useState('Direct');
  const [transitCountry, setTransitCountry] = useState('');
  const [transitPort, setTransitPort] = useState('');
  const [entryPort, setEntryPort] = useState('Jebel Ali');

  const isMultiple = transitType === 'Multiple';
  const [legs, setLegs] = useState<Leg[]>([]);
  const [routeModal, setRouteModal] = useState(false);

  const [items, setItems] = useState<HsRow[]>(HS_ROWS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [rowMenu, setRowMenu] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  /* Confirmation shown above the table after a line item is saved. */
  const [addedNotice, setAddedNotice] = useState<number>(0);
  /* Bumped after each add so the panel remounts blank and stays open for the next item. */
  const [panelKey, setPanelKey] = useState(0);
  const [hsSearch, setHsSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const countryRoute = legs.map(l => l.country).filter(Boolean).join(' -> ');
  const portRoute = legs.map(l => l.port).filter(Boolean).join(' -> ');

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const [colOrder, setColOrder] = useState<string[]>(HS_COLS.map(c => c.key));
  const orderedCols = colOrder.map(k => HS_COLS.find(c => c.key === k)!).filter(Boolean);
  const tableMinWidth = orderedCols.reduce((s, c) => s + getW(c.key, c.w), 0) + HS_STICKY_W + HS_CHECK_W;

  /* Search narrows the table without changing the underlying list, so row
     indexes stay stable for edit / delete. */
  const visibleItems = items
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      if (!hsSearch.trim()) return true;
      const q = hsSearch.trim().toLowerCase();
      return row.hsCode.toLowerCase().includes(q) || row.goodsDescription.toLowerCase().includes(q);
    });

  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every(({ index }) => selectedItems.has(index));
  const toggleSelectAll = () => setSelectedItems(prev => {
    const next = new Set(prev);
    if (allVisibleSelected) visibleItems.forEach(({ index }) => next.delete(index));
    else visibleItems.forEach(({ index }) => next.add(index));
    return next;
  });
  const toggleSelect = (index: number) => setSelectedItems(prev => {
    const next = new Set(prev);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const deleteSelected = () => {
    setItems(p => p.filter((_, i) => !selectedItems.has(i)));
    setSelectedItems(new Set());
    setExpanded(null);
    setAddedNotice(0);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rowMenu === null) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setRowMenu(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [rowMenu]);

  const closePanel = () => { setPanelOpen(false); setEditIndex(null); };

  /* Same edit affordance as the Integrated Clearance module — filled blue tile. */
  const editPencil = (
    <span className="inline-flex items-center justify-center rounded-[6px] flex-shrink-0"
      style={{ width: 34, height: 34, background: '#1360d2' }}>
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M4 20h4l11-11-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 6l4 4" strokeLinecap="round" />
      </svg>
    </span>
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

        <SiraStepper steps={SIRA_STEPS} current={0} />

        {/* ── Request Information ── */}
        <SiraCard title="Request Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] mb-[26px]">
            <SiraSelect label="Request Type"     value={requestType}     options={REQUEST_TYPES}     onChange={setRequestType} />
            <SiraSelect label="Product Category" value={productCategory} options={PRODUCT_CATEGORIES} onChange={setProductCategory} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[26px]">
            <SiraSelect label="Importer" value={importer} options={IMPORTERS} onChange={setImporter} />
            <SiraInput  label="Vendor"   value={vendor}   onChange={setVendor} />
            <SiraInput  label="Shipping Company" value={shippingCompany} onChange={setShippingCompany} />
            <SiraSelect label="Transportation Method" value={transportation} options={TRANSPORTATION_METHODS} onChange={setTransportation} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[26px]">
            <SiraInput  label="BOL /AWB" value={bol} onChange={setBol} />
            <SiraInput  label="Shipping Invoice Number" value={invoiceNo} onChange={setInvoiceNo} />
            <SiraSelect label="Country of Loading" value={countryLoading} options={COUNTRIES} onChange={setCountryLoading} />
            <SiraSelect label="Port of Loading"    value={portLoading}    options={PORTS}     onChange={setPortLoading} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <SiraSelect label="Transit via Type" value={transitType} options={TRANSIT_VIA_TYPES} onChange={setTransitType} />

            {/* "Multiple" turns the two transit fields into editable route fields (Figma 90:6295) */}
            {isMultiple ? (
              <>
                <SiraInput label="Transit via Country" value={countryRoute}
                  onChange={() => {}} placeholder="Add the transit route"
                  suffix={editPencil} onSuffixClick={() => setRouteModal(true)} />
                <SiraInput label="Transit via Port" value={portRoute}
                  onChange={() => {}} placeholder="Add the transit route"
                  suffix={editPencil} onSuffixClick={() => setRouteModal(true)} />
              </>
            ) : (
              <>
                <SiraSelect label="Transit via Country" value={transitCountry} options={COUNTRIES} onChange={setTransitCountry} />
                <SiraSelect label="Transit via Port"    value={transitPort}    options={PORTS}     onChange={setTransitPort} />
              </>
            )}

            <SiraSelect label="Entry in via Dubai Port" value={entryPort} options={DUBAI_ENTRY_PORTS} onChange={setEntryPort} />
          </div>
        </SiraCard>

        {/* ── HS Code Details ── */}
        <SiraCard
          title="HS Code Details"
          action={
            <button
              onClick={() => { setEditIndex(null); setPanelOpen(true); }}
              className="h-[48px] px-[30px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}
            >
              Add New Items
            </button>
          }
        >
          {/* Add / edit item accordion — sits above the table, closed with the × */}
          {panelOpen && (
            <AddItemPanel
              key={editIndex !== null ? `edit-${editIndex}` : `new-${panelKey}`}
              editing={editIndex !== null}
              initial={editIndex !== null ? items[editIndex] : undefined}
              onClose={closePanel}
              onSave={row => {
                if (editIndex !== null) {
                  setItems(p => p.map((r, i) => (i === editIndex ? row : r)));
                  closePanel();
                  return;
                }
                /* Adding: keep the card open with a blank form so the next item
                   can be entered straight away — it closes only via the ×. */
                setItems(p => [...p, row]);
                setAddedNotice(n => n + 1);
                setPanelKey(k => k + 1);
              }}
            />
          )}

          {/* Confirmation of what was just added */}
          {addedNotice > 0 && (
            <div className="flex items-center gap-[10px] rounded-[4px] px-[14px] py-[10px] mb-[14px]"
              style={{ background: 'rgba(40,167,69,0.10)', border: '1px solid rgba(40,167,69,0.35)' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#28a745" strokeWidth="2.2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="9.5" /><path d="M8 12.2l2.8 2.8L16 9.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[15px] text-[#1a7a45] font-medium" style={{ fontFamily: font }}>
                {addedNotice} HS Code added
              </span>
              <button onClick={() => setAddedNotice(0)} aria-label="Dismiss"
                className="ml-auto size-[22px] rounded-full flex items-center justify-center text-[#1a7a45] hover:bg-white/70 transition-colors">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          {/* Search + bulk actions above the table */}
          <div className="flex items-center gap-[12px] mb-[14px] flex-wrap">
            <div className="relative" style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 380 }}>
              <div className="flex items-center bg-white rounded-[4px] h-[48px]" style={{ border: '1px solid #d5ddfb' }}>
                <input
                  value={hsSearch}
                  onChange={e => setHsSearch(e.target.value)}
                  placeholder="Search HS Code"
                  className="flex-1 px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                  style={{ fontFamily: font }}
                />
                {hsSearch && (
                  <button type="button" onClick={() => setHsSearch('')} aria-label="Clear search"
                    className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                <span className="pr-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M12 12l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>

            <p className="text-[15px] font-medium text-[#0e1b3d]" style={{ fontFamily: font }}>
              {hsSearch ? `${visibleItems.length} of ${items.length}` : items.length} Line items available
            </p>

            <div className="flex-1" />

            {selectedItems.size > 0 && (
              <button onClick={deleteSelected}
                className="h-[48px] px-[20px] rounded-[4px] border border-[#dc3545] text-[16px] text-[#dc3545] bg-white hover:bg-[#fdf1f2] transition-colors flex items-center gap-[8px]"
                style={{ fontFamily: font, fontWeight: 500 }}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                </svg>
                Delete Selected ({selectedItems.size})
              </button>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd}
              onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={HS_STICKY_W} />
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
                    <th style={{
                      width: HS_CHECK_W, minWidth: HS_CHECK_W, background: '#a6c2e9',
                      padding: '18px 8px 10px', textAlign: 'center', borderRadius: '8px 0 0 0',
                    }}>
                      <input
                        type="checkbox"
                        aria-label="Select all line items"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        className="size-[18px] rounded-[3px] border-2 border-[#5a6478] cursor-pointer align-middle"
                      />
                    </th>
                    {orderedCols.map((col, idx) => (
                      <th key={col.key} data-col-key={col.key}
                        style={{
                          position: 'relative',
                          width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                          padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
                          paddingLeft: idx === 0 ? 16 : 8,
                          ...getThStyle(col.key),
                        }}
                        onDragOver={e => onDragOver(col.key, e)}
                        onDragLeave={onDragLeave}
                        onDrop={e => onDrop(col.key, e, colOrder, setColOrder)}
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
                      position: 'sticky', right: 0, width: HS_STICKY_W, minWidth: HS_STICKY_W,
                      background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                      boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderRadius: '0 8px 0 0', zIndex: 2,
                    }}>
                      <span className="text-[16px] font-medium text-[#051937]">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map(({ row, index: i }) => (
                    <React.Fragment key={`${row.hsCode}-${i}`}>
                      <tr>
                        <td style={{
                          background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                          width: HS_CHECK_W, minWidth: HS_CHECK_W,
                        }}>
                          <input
                            type="checkbox"
                            aria-label={`Select ${row.hsCode}`}
                            checked={selectedItems.has(i)}
                            onChange={() => toggleSelect(i)}
                            className="size-[18px] rounded-[3px] border-2 border-[#c0c6cf] cursor-pointer align-middle"
                          />
                        </td>
                        {orderedCols.map((col, ci) => (
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
                              {col.key === 'valueOfGoods'
                                ? <DhAmount value={row.valueOfGoods} />
                                : row[col.key]}
                            </span>
                          </td>
                        ))}
                        <td style={{
                          background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff',
                          position: 'sticky', right: 0, width: HS_STICKY_W, minWidth: HS_STICKY_W,
                          boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                          zIndex: rowMenu === i ? 60 : 1,
                        }}>
                          <div className="flex items-center gap-[6px]">
                            <div className="relative" ref={rowMenu === i ? menuRef : undefined}>
                              <button onClick={() => setRowMenu(rowMenu === i ? null : i)} aria-label="Line item actions"
                                className="size-[30px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                                <svg viewBox="0 0 20 20" width="17" height="17" fill="#697498">
                                  <circle cx="10" cy="4" r="1.6" /><circle cx="10" cy="10" r="1.6" /><circle cx="10" cy="16" r="1.6" />
                                </svg>
                              </button>
                              {rowMenu === i && (
                                <div className="absolute z-[120] right-0 top-[34px] bg-white rounded-[8px] py-[4px]"
                                  style={{ width: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
                                  <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]"
                                    style={{ fontFamily: font }}
                                    onClick={() => { setEditIndex(i); setPanelOpen(true); setRowMenu(null); }}>Edit</button>
                                  <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#dc3545] hover:bg-[#fdf1f2]"
                                    style={{ fontFamily: font }}
                                    onClick={() => { setItems(p => p.filter((_, idx) => idx !== i)); setRowMenu(null); }}>Delete</button>
                                </div>
                              )}
                            </div>
                            <button onClick={() => setExpanded(expanded === i ? null : i)} aria-label="Toggle details"
                              className="size-[28px] rounded-full border border-[#e2e8f5] flex items-center justify-center hover:bg-[#f0f4ff] transition-colors">
                              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#697498" strokeWidth="2.4"
                                className={`transition-transform ${expanded === i ? 'rotate-180' : ''}`}>
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded === i && (
                        <tr>
                          <td colSpan={orderedCols.length + 2}
                            style={{ background: '#f6f9ff', padding: '14px 16px', borderBottom: '1px solid #f0f4ff', borderRadius: 8 }}>
                            <div className="flex gap-[40px] flex-wrap">
                              <span className="text-[15px] text-[#5a6478]" style={{ fontFamily: font }}>
                                Country of Origin: <span className="text-[#0e1b3d] font-medium">{row.countryOfOrigin || '—'}</span>
                              </span>
                              <span className="text-[15px] text-[#5a6478]" style={{ fontFamily: font }}>
                                Serial Number: <span className="text-[#0e1b3d] font-medium">{row.serialNumber || '—'}</span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {visibleItems.length === 0 && (
                    <tr>
                      <td colSpan={orderedCols.length + 2} className="text-center py-12 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                        {items.length === 0 ? 'No line items added yet' : 'No line item matches your search'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SiraCard>
      </div>

      <SiraFooter onBack={onBack} primaryLabel="Next" onPrimary={() => onNext(productCategory)} />

      {routeModal && (
        <TransitRouteModal
          legs={legs}
          onClose={() => setRouteModal(false)}
          onSave={l => { setLegs(l); setRouteModal(false); }}
        />
      )}
    </div>
  );
}
