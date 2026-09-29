import React, { useEffect, useRef, useState } from 'react';
import { DateInput } from '../DatePicker';

export const font = "'Dubai', sans-serif";

/* ──────────────────────────────────────────────────────────────
   Floating-label field primitives shared across the SIRA screens.
   Same visual language as the Integrated Clearance module: 56px
   outlined box, label rides up into the border on focus / value.
   ────────────────────────────────────────────────────────────── */

function labelStyle(active: boolean): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: '#0e1b3d',
    background: active ? '#fff' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}

function Req() {
  return <span style={{ color: '#dc3545' }}>*</span>;
}

export const XClear = ({ onClear, right = 10 }: { onClear: (e: React.MouseEvent) => void; right?: number }) => (
  <button type="button" onClick={onClear} aria-label="Clear"
    style={{ position: 'absolute', right, top: '50%', transform: 'translateY(-50%)',
      width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#b0b8d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, zIndex: 2 }}>
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
      <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </button>
);

/* ── Text input ── */
export function SiraInput({
  label, value, onChange, required, readOnly, suffix, onSuffixClick, placeholder,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  required?: boolean; readOnly?: boolean;
  suffix?: React.ReactNode; onSuffixClick?: () => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // A placeholder occupies the field's centre line, so the label has to stay floated.
  const active = focused || value.length > 0 || !!placeholder;
  const showX = !!(value && hovered && onChange && !readOnly && !suffix);
  return (
    <div className="relative min-w-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <input
        type="text" value={value} readOnly={readOnly} placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{
          fontFamily: font,
          paddingRight: suffix ? 52 : showX ? 40 : 12,
          border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
          cursor: readOnly ? 'default' : undefined,
        }}
      />
      <span style={labelStyle(active)}>{required && <Req />}{required ? ' ' : ''}{label}</span>
      {showX && <XClear onClear={e => { e.preventDefault(); onChange?.(''); }} />}
      {suffix && (
        <button type="button" onClick={onSuffixClick}
          className="absolute right-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center hover:opacity-80"
          style={{ zIndex: 2 }}>
          {suffix}
        </button>
      )}
    </div>
  );
}

/* ── Select / dropdown ── */
export function SiraSelect({
  label, value, options, onChange, required, disabled,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
  required?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = open || value !== '';

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="relative min-w-0" ref={ref}>
      <button
        type="button" disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] bg-white focus:outline-none text-left disabled:opacity-60"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}
      >
        <span className="flex-1 truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span style={labelStyle(active)}>{required && <Req />}{required ? ' ' : ''}{label}</span>
      {open && (
        <div className="absolute z-[300] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] max-h-[280px] overflow-y-auto"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => {
            const selected = opt === value;
            return (
              <button key={opt} type="button"
                className="w-full px-[14px] py-[10px] text-left text-[16px] transition-colors"
                style={{
                  fontFamily: font,
                  background: selected ? '#1360d2' : 'transparent',
                  color: selected ? '#fff' : '#111838',
                  fontWeight: selected ? 600 : 400,
                }}
                onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = '#e2ebf9'; }}
                onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                onClick={() => { onChange(opt); setOpen(false); }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Date ── */
export function SiraDate({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return <DateInput label={required ? `* ${label}` : label} value={value} onChange={onChange} />;
}

/* ── Value + unit combo (Gross / Net / Total weight) ── */
export function SiraValueUnit({
  label, value, onChange, unit, onUnitChange, units, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  unit: string; onUnitChange: (v: string) => void; units: string[]; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="relative flex min-w-0" ref={ref}>
      <div className="relative flex-1 min-w-0">
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="h-[56px] w-full rounded-l-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
          style={{ fontFamily: font, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRight: 'none' }}
        />
        <span style={labelStyle(active)}>{required && <Req />}{required ? ' ' : ''}{label}</span>
      </div>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-[56px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] bg-white rounded-r-[4px] flex-shrink-0"
        style={{ fontFamily: font, border: '1px solid #d5ddfb' }}>
        {unit}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute z-[300] top-[60px] right-0 bg-white rounded-[8px] py-[4px]"
          style={{ minWidth: 90, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {units.map(u => (
            <button key={u} type="button" className="w-full px-[14px] py-[8px] text-left text-[16px] text-[#111838] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => { onUnitChange(u); setOpen(false); }}>{u}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Card shell used by every SIRA form section ── */
export function SiraCard({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] p-[24px] mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-[24px] gap-4 flex-wrap">
          {title && <h2 className="text-[20px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Step progress bar (Request Details → Cargo Details → Attachments → Pay & Submit) ── */
export function SiraStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="bg-white rounded-[8px] py-[18px] px-[24px] mb-[20px] flex items-center justify-center"
      style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
      <div className="flex items-center flex-wrap justify-center gap-y-3">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reached = done || active;
          const color = done ? '#12b76a' : reached ? '#1360d2' : '#98a2b3';
          return (
            <React.Fragment key={s}>
              <div className="flex items-center gap-[8px] flex-shrink-0">
                <span className="size-[22px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: done ? '#12b76a' : active ? '#1360d2' : 'transparent', border: `1.5px solid ${color}` }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
                    stroke={reached ? '#fff' : '#98a2b3'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-[16px] whitespace-nowrap"
                  style={{ fontFamily: font, color, fontWeight: active ? 600 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="mx-[14px] flex-shrink-0" style={{ width: 90, height: 2, background: done ? '#12b76a' : i < current ? '#1360d2' : '#1360d2' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── Sticky bottom action bar ── */
export function SiraFooter({ onBack, backLabel = 'Back', primaryLabel, onPrimary }: {
  onBack?: () => void; backLabel?: string; primaryLabel?: string; onPrimary?: () => void;
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white flex items-center justify-between px-[40px] py-[16px] flex-shrink-0"
      style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)', zIndex: 30 }}>
      {onBack ? (
        <button onClick={onBack}
          data-secondary-btn
          className="h-[48px] px-[36px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
          style={{ fontFamily: font, fontWeight: 500 }}>
          {backLabel}
        </button>
      ) : <span />}
      {primaryLabel && (
        <button onClick={onPrimary}
          className="h-[48px] px-[42px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
          {primaryLabel}
        </button>
      )}
    </div>
  );
}
