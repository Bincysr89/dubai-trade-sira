import { useState } from 'react';
import Header from './Header';
import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
import integratedClearanceSrc from '../assets/integratedclearance.svg';
import paymentsSrc from '../assets/payments.svg';
import cargoWavesSrc from '../assets/cargowaves.svg';
import waveSrc from '../assets/wave.svg';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onClose: () => void;
  /** Opens the permit assistant chatbot with Import / Sea pre-answered. */
  onApplyPermits: () => void;
  /** Default Cargo Channel / Regime Type for the declaration form (from landing toggles). */
  defaults?: { cargoChannel?: string; regimeType?: string };
};

type Step = 'start' | 'carrier' | 'invoice' | 'invoiceList' | 'documents';

/* ── Journey stepper (Import by Sea → … → Cargo Waves), Integrated Clearance active ── */
function JourneyStepper({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-4 md:px-10 pt-[16px] pb-[24px] flex justify-center">
      <div
        className="bg-white rounded-[8px] pl-[16px] pr-[10px] py-[10px] flex items-center gap-[6px] w-full max-w-[1240px]"
        style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}
      >
        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center w-max mx-auto">
            <div className="flex items-center gap-[10px] flex-shrink-0">
              <img src={importBySeaSrc} alt="Import by Sea" className="h-[30px] w-auto flex-shrink-0" />
              <span className="text-[16px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>Import by Sea</span>
            </div>
            <div className="flex items-center flex-shrink-0 mx-[10px]">
              <svg viewBox="0 0 14 46" width="14" height="46" fill="none"><path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg>
            </div>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={tradePlusSrc} alt="Trade +" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: font }}>Trade +</span>
            </div>
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />
            <div className="flex items-center gap-[8px] flex-shrink-0 px-[10px] py-[5px] rounded-[22px]" style={{ border: '2px solid #28a745', boxShadow: '0 0 18px 0 rgba(40,167,69,0.25)', background: '#fff' }}>
              <div className="size-[36px] rounded-full border-2 border-[#28a745] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={integratedClearanceSrc} alt="Integrated Clearance" className="size-[20px] object-contain" />
              </div>
              <span className="text-[18px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>Integrated Clearance</span>
            </div>
            <div className="mx-[10px] flex items-center" style={{ width: 100 }}><img src={waveSrc} alt="" style={{ width: 100, height: 16 }} /></div>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={paymentsSrc} alt="Payments" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: font }}>Payments</span>
            </div>
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={cargoWavesSrc} alt="Cargo Waves" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: font }}>Cargo Waves</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 ml-[6px] size-[28px] rounded-full border border-[#d5ddfb] flex items-center justify-center text-[#8f94ae] hover:text-[#0e1b3d] hover:border-[#0e1b3d] transition-colors">
          <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ── Field with a true floating label (inside when empty, floats up on focus/value) ── */
function Field({
  label, value, required, readOnly, select, search, onChange, placeholder, options,
}: {
  label: string; value: string; required?: boolean; readOnly?: boolean;
  select?: boolean; search?: boolean; placeholder?: string; options?: string[];
  onChange?: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const editable = !readOnly && !!onChange;
  const isDropdown = !!options && !readOnly && !!onChange;
  const floated = focused || open || !!value || readOnly;
  const fieldBg = readOnly ? '#f4f6fa' : '#fff';
  if (isDropdown) {
    return (
      <div className="relative rounded-[4px] border min-w-0" style={{ height: 56, borderColor: open ? '#1360d2' : '#d5ddfb', background: '#fff' }}>
        {label && (
          <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{ left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)', background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0, fontSize: floated ? 12 : 16, color: open ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>{required && <span style={{ color: '#ea2428' }}>* </span>}{label}</span>
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} onBlur={() => setTimeout(() => setOpen(false), 120)} className="flex items-center h-full w-full px-[14px] gap-[6px] text-left">
          <span className="text-[16px] text-[#0e1b3d] truncate flex-1" style={{ fontFamily: font }}>{value}</span>
          <svg viewBox="0 0 24 24" className={`size-[18px] flex-shrink-0 text-[#697498] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {open && (
          <div className="absolute left-0 top-[60px] z-[20] w-full bg-white rounded-[6px] py-[4px]" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {options!.map((o) => (
              <button key={o} type="button" onMouseDown={() => { onChange!(o); setOpen(false); }} className="block w-full text-left px-[14px] py-[9px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: o === value ? 500 : 400 }}>{o}</button>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      className="relative rounded-[4px] border min-w-0"
      style={{ height: 56, borderColor: focused ? '#1360d2' : '#d5ddfb', background: fieldBg }}
    >
      {label && (
        <span
          className="absolute pointer-events-none whitespace-nowrap transition-all"
          style={{
            left: floated ? 10 : 14,
            top: floated ? -9 : '50%',
            transform: floated ? 'none' : 'translateY(-50%)',
            background: floated ? fieldBg : 'transparent',
            padding: floated ? '0 4px' : 0,
            fontSize: floated ? 12 : 16,
            color: focused ? '#1360d2' : floated ? '#5a6282' : '#8f94ae',
            fontFamily: font, transitionDuration: '120ms', zIndex: 1,
          }}
        >
          {required && <span style={{ color: '#ea2428' }}>* </span>}{label}
        </span>
      )}
      <div className="flex items-center h-full px-[14px] gap-[6px]">
        {editable ? (
          <input
            value={value}
            onChange={(e) => onChange!(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={!label ? placeholder : ''}
            className="text-[16px] text-[#0e1b3d] w-full focus:outline-none bg-transparent placeholder:text-[#a7abbd]"
            style={{ fontFamily: font }}
          />
        ) : (
          <span
            className="text-[16px] truncate flex-1"
            style={{ color: value ? '#0e1b3d' : '#a7abbd', fontFamily: font }}
          >
            {value || (!label ? placeholder : '')}
          </span>
        )}
        {select && (
          <svg viewBox="0 0 24 24" className="size-[18px] flex-shrink-0 text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
        )}
        {search && (
          <svg viewBox="0 0 18 18" width="18" height="18" className="flex-shrink-0" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
        )}
      </div>
    </div>
  );
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);

export default function ClearanceJourneyPage({ onClose, onApplyPermits, defaults }: Props) {
  const [step, setStep] = useState<Step>('start');
  const [invoiceTab, setInvoiceTab] = useState<'upload' | 'manual'>('upload');
  const [dragging, setDragging] = useState(false);
  const [addLineItem, setAddLineItem] = useState(false);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#f8fafd]" style={{ fontFamily: font }}>
      <div className="flex-shrink-0"><Header onHome={onClose} /></div>

      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[4px] flex-wrap gap-y-[6px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
            <span className="text-[#dc3545] text-[15px]">/</span>
            <span className="text-[#8f94ae] text-[16px]">Import By Sea</span>
            <span className="text-[#dc3545] text-[15px]">/</span>
            <span className="text-[#111838] text-[16px] font-medium">Integrated Clearance</span>
          </div>
          <div className="px-[16px] py-[4px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>
            A180-IMPORTER SONY GULF UAE
          </div>
        </div>

        <JourneyStepper onClose={onClose} />

        <div className="px-4 md:px-10 pb-[24px]">
          <h1 className="text-[30px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Integrated Clearance</h1>

          {step === 'start' && <StartStep onProceed={() => setStep('carrier')} defaults={defaults} />}
          {step === 'carrier' && <CarrierStep />}
          {addLineItem ? (
            <AddLineItem />
          ) : (<>
          {step === 'invoice' && (
            <InvoiceStep
              tab={invoiceTab} setTab={setInvoiceTab}
              dragging={dragging} setDragging={setDragging}
              onUpload={() => setStep('invoiceList')}
              onAddLineItem={() => setAddLineItem(true)}
            />
          )}
          {step === 'invoiceList' && <InvoiceListStep onAddLineItem={() => setAddLineItem(true)} />}
          {step === 'documents' && <DocumentsStep />}
          </>)}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button data-secondary-btn
          onClick={() => {
            if (addLineItem) { setAddLineItem(false); return; }
            if (step === 'carrier') setStep('start');
            else if (step === 'invoice') setStep('carrier');
            else if (step === 'invoiceList') setStep('invoice');
            else if (step === 'documents') setStep('invoiceList');
            else onClose();
          }}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Back</button>

        <div className="flex items-center gap-[12px]">
          {addLineItem && (<>
            <button onClick={() => setAddLineItem(false)} data-secondary-btn className="h-[48px] px-[28px] rounded-[4px] border text-[16px] bg-white transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Cancel</button>
            <button onClick={() => { setAddLineItem(false); if (step === 'invoice') setStep('invoiceList'); }} className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors" style={{ background: '#1360d2', fontWeight: 500 }}>Save</button>
          </>)}
          {!addLineItem && (step === 'start' || step === 'carrier') && (
            <button
              onClick={() => setStep(step === 'start' ? 'carrier' : 'invoice')}
              className="h-[48px] px-[32px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ background: '#1360d2', fontWeight: 500 }}
            >Save</button>
          )}
          {!addLineItem && (step === 'invoice' || step === 'invoiceList') && (
            <button
              onClick={() => setStep(step === 'invoice' ? 'invoiceList' : 'documents')}
              className="h-[48px] px-[32px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ background: '#1360d2', fontWeight: 500 }}
            >Proceed</button>
          )}
          {!addLineItem && step === 'documents' && (
            <>
              <button data-secondary-btn
                className="h-[48px] px-[24px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
              >Proceed To Review &amp; Submit Declaration</button>
              <button
                onClick={onApplyPermits}
                className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}
              >Apply For Permits / Certificates</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Start clearance ── */
function StartStep({ onProceed, defaults }: { onProceed: () => void; defaults?: { cargoChannel?: string; regimeType?: string } }) {
  const [channel, setChannel] = useState(defaults?.cargoChannel ?? 'Sea');
  const [regime, setRegime] = useState(defaults?.regimeType ?? 'Import');
  // Sea → BOL Number + Vessel Information · Air → AWB Number + Flight Number
  const isSea = channel === 'Sea';
  const [f3, setF3] = useState(isSea ? 'BOL122324' : 'AWB1234567');
  const [f4, setF4] = useState(isSea ? 'MSK13324' : 'EK1234');
  const [ref, setRef] = useState('A113384');
  const onChannel = (v: string) => {
    setChannel(v);
    if (v === 'Sea') { setF3('BOL122324'); setF4('MSK13324'); }
    else { setF3('AWB1234567'); setF4('EK1234'); }
  };
  return (
    <>
      <Card className="p-[24px] mb-[24px]">
        <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Enter the Details to Start Clearance Process</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[16px] items-center">
          <Field label="Cargo Channel" value={channel} onChange={onChannel} options={['Sea', 'Air']} required select />
          <Field label="Regime Type" value={regime} onChange={setRegime} options={['Import', 'Export']} required select />
          <Field label={isSea ? 'BOL Number' : 'AWB Number'} value={f3} onChange={setF3} required />
          <Field label={isSea ? 'Vessel Information' : 'Flight Number'} value={f4} onChange={setF4} required />
          <Field label="Client Doc. Ref. Number" value={ref} onChange={setRef} required />
          <button onClick={onProceed} className="h-[56px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors" style={{ background: '#1360d2', fontWeight: 500 }}>Proceed</button>
        </div>
      </Card>

      {/* Help and Guides */}
      <div className="flex items-center gap-[10px] mb-[16px]">
        <svg viewBox="0 0 24 24" className="size-[22px] text-[#0e1b3d]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
        <h2 className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Help and Guides</h2>
      </div>
      <div className="flex items-center gap-[4px] mb-[16px] bg-white rounded-[6px] p-[4px] w-max" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.12)' }}>
        {['Information', 'Tutorials', "Common FAQ'S", 'Updates', 'Downloads'].map((t, i) => (
          <span key={t} className="text-[15px] px-[18px] py-[8px] rounded-[4px] cursor-pointer" style={i === 0 ? { background: '#1360d2', color: '#fff', fontWeight: 500 } : { color: '#5a6282' }}>{t}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-start">
        <div className="flex flex-col gap-[20px]">
          <Card className="p-[20px]">
            <p className="text-[17px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 600 }}>About the Service</p>
            <p className="text-[15px] text-[#5a6282] leading-relaxed">Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.</p>
            <p className="text-[15px] text-[#5a6282] mt-[6px]">View the declaration assistant. <span className="text-[#1360d2] cursor-pointer">Click here</span></p>
          </Card>
          <Card className="p-[20px]">
            <p className="text-[17px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Service Delivery Procedure</p>
            <div className="flex items-start gap-[14px]">
              <div className="size-[26px] rounded-full bg-[#28a745] text-white text-[14px] flex items-center justify-center flex-shrink-0" style={{ fontWeight: 600 }}>1</div>
              <div>
                <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Request Submission</p>
                <p className="text-[14px] text-[#5a6282]">Fill the request information like regime type, declaration Type, cargo channel etc</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between px-[20px] py-[14px] rounded-t-[8px]" style={{ background: '#d7e6fb' }}>
            <p className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Services Details</p>
            <svg viewBox="0 0 24 24" className="size-[20px] text-[#0e1b3d]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-[22px] gap-x-[16px] p-[20px]">
            {[
              ['Service Type', 'Transactional'], ['Target Category', 'Companies'], ['Service Completion Time', '1 Working Day'],
              ['Service Delivery Time', 'Available around the clock'], ['Relationship Type', 'From Government to Business'], ['Service Interconnection', 'Request No Objection for Customs Broker'],
              ['Service Delivery Channel', 'Website • Mobile Web'], ['Bundle', 'N/A'], ['Service Hierarchy', 'Sub Service'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-[10px]">
                <svg viewBox="0 0 24 24" className="size-[18px] text-[#1360d2] flex-shrink-0 mt-[2px]" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
                <div>
                  <p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{k}</p>
                  <p className="text-[13px] text-[#5a6282] leading-snug">• {v}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* Read-only top form used on steps 2-4 */
function ReadOnlyForm({ channel = 'Sea', regime = 'Import', third = ['BOL Number', 'AWB1234567'], fourth = ['FVessel Information', 'EK1234'] }: { channel?: string; regime?: string; third?: [string, string]; fourth?: [string, string]; }) {
  return (
    <Card className="p-[24px] mb-[24px]">
      <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Enter the Details to Start Clearance Process</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[16px]">
        <Field label="Cargo Channel" value={channel} required readOnly />
        <Field label="Regime Type" value={regime} required readOnly select />
        <Field label={third[0]} value={third[1]} required readOnly />
        <Field label={fourth[0]} value={fourth[1]} required readOnly />
        <Field label="Client Doc. Ref. Number" value="A113384" required readOnly />
      </div>
    </Card>
  );
}

/* ── Step 2: Carrier + Exporter ── */
function CarrierStep() {
  const [carrier, setCarrier] = useState('680523');
  const [mawb, setMawb] = useState('B87654');
  const [exporter, setExporter] = useState('AE1006');
  const [pcc, setPcc] = useState('PC0007007');
  return (
    <>
      <ReadOnlyForm />

      <Card className="p-[24px] mb-[24px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[720px]">
          <Field label="Carrier Registration Number" value={carrier} onChange={setCarrier} required search />
          <Field label="MAWB/MBOL" value={mawb} onChange={setMawb} required />
        </div>
      </Card>

      <h2 className="text-[20px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 700 }}>Exporter Code</h2>
      <p className="text-[15px] text-[#5a6282] mb-[16px]">Add imported code directly or use Quick/Advance search to choose personal customer code.</p>

      <Card className="p-[24px]">
        <div className="flex flex-wrap items-start gap-x-[28px] gap-y-[16px]">
          <div className="min-w-[240px] flex-1">
            <label className="text-[14px] text-[#0e1b3d] block mb-[6px]"><span className="text-[#ea2428]">*</span>Choose Exporter Code</label>
            <Field label="" value={exporter} onChange={setExporter} search />
            <div className="mt-[6px] px-[12px] py-[8px] rounded-[4px] text-[14px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>Sony Gulf FZE</div>
          </div>
          <div className="flex items-center pt-[30px] text-[15px] text-[#5a6282]">Or</div>
          <div className="min-w-[240px] flex-1">
            <label className="text-[14px] text-[#0e1b3d] block mb-[6px]">Choose Personal Customer Code</label>
            <Field label="" value={pcc} onChange={setPcc} search />
            <div className="mt-[6px] px-[12px] py-[8px] rounded-[4px] text-[14px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>Naresh</div>
          </div>
          <div className="flex items-center gap-[6px] pt-[34px] text-[#1360d2] text-[15px] cursor-pointer">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg>
            Advance Search
          </div>
          <button data-secondary-btn className="mt-[28px] h-[44px] px-[18px] rounded-[4px] border text-[15px] transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Add New Personal Customer</button>
        </div>
      </Card>
    </>
  );
}

/* ── Step 3: Invoice details — upload ── */
function InvoiceStep({ tab, setTab, dragging, setDragging, onUpload, onAddLineItem }: {
  tab: 'upload' | 'manual'; setTab: (t: 'upload' | 'manual') => void;
  dragging: boolean; setDragging: (b: boolean) => void; onUpload: () => void; onAddLineItem: () => void;
}) {
  return (
    <>
      <ReadOnlyForm channel="Air" regime="Export" third={['AWB Number', 'AWB1234567']} fourth={['Flight Information', 'EK1234']} />

      <h2 className="text-[20px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 700 }}>Invoice Details</h2>
      <p className="text-[15px] text-[#5a6282]">You can add invoice details manually or upload a Text file.</p>
      <p className="text-[15px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Please note: Mandatory for Declaration Submission</p>

      <div className="flex items-center gap-[8px] mb-[16px] bg-white rounded-[6px] p-[4px] w-max" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.12)' }}>
        {(['upload', 'manual'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-[15px] px-[18px] py-[9px] rounded-[4px]" style={tab === t ? { background: '#1360d2', color: '#fff', fontWeight: 500 } : { color: '#5a6282' }}>
            {t === 'upload' ? 'Upload Text File' : 'Add Manually'}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <Card className="p-[24px] max-w-[520px]">
          <div className="flex items-center justify-between mb-[6px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Upload Text File</p>
            <span className="flex items-center gap-[6px] text-[#1360d2] text-[14px] cursor-pointer">
              <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Download Template
            </span>
          </div>
          <p className="text-[13px] text-[#8f94ae] mb-[14px]">*Supported file type of .TXT max file size up to 150 KB</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); }}
            className="flex flex-col items-center justify-center gap-[12px] rounded-[6px] py-[36px] transition-colors"
            style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#f8fafd' }}
          >
            <div className="size-[54px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
            </div>
            <p className="text-[15px] text-[#6d707e]">Drag and drop or</p>
            <button onClick={onUpload} data-secondary-btn className="h-[42px] px-[22px] rounded-[4px] border text-[15px] bg-white transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Upload File</button>
          </div>
        </Card>
      )}

      {tab === 'manual' && <ManualInvoice onSave={onUpload} onAddLineItem={onAddLineItem} />}
    </>
  );
}

/* ── Add Manually: Invoice Header (Add Line Item opens as a full page from InvoiceStep) ── */
function ManualInvoice({ onSave, onAddLineItem }: { onSave: () => void; onAddLineItem: () => void }) {
  const sel = ['Select', ''];
  return (
    <Card className="p-[24px]">
      <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Add Invoice Header</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[16px]">
        <Field label="Invoice Number" value="" onChange={() => {}} required placeholder="Invoice number" />
        <Field label="Invoice Date" value="08/17/2023" onChange={() => {}} required />
        <Field label="Seller" value="" onChange={() => {}} required search placeholder="Seller Name" />
        <Field label="Number of Pages" value="12" onChange={() => {}} required />
        <Field label="Invoice Type" value="" onChange={() => {}} options={['Commercial', 'Proforma']} required select />
        <Field label="Terms of Delivery" value="" onChange={() => {}} options={['Cost & Fright', 'FOB', 'CIF']} required select />
        <Field label="Payment Term" value="12 Months" onChange={() => {}} options={['12 Months', '6 Months', 'Advance']} required select />
        <Field label="Freight Cost" value="" onChange={() => {}} required placeholder="Freight Cost" />
        <Field label="Freight Cost Currency" value="" onChange={() => {}} options={['AED', 'USD', 'EUR']} required select />
        <Field label="Insurance Cost" value="" onChange={() => {}} required placeholder="Enter Value" />
        <Field label="Insurance Cost Currency" value="" onChange={() => {}} options={['AED', 'USD', 'EUR']} required select />
        <Field label="Invoice Value" value="" onChange={() => {}} required placeholder="Enter Value" />
        <Field label="Invoice Currency" value="" onChange={() => {}} options={['AED', 'USD', 'EUR']} required select />
      </div>
      <div className="flex items-center justify-between flex-wrap gap-[12px] pt-[8px]">
        <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>CIF Value</p>
        <div className="flex items-center gap-[12px] flex-wrap">
          <button data-secondary-btn className="h-[44px] px-[22px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Close</button>
          <button onClick={onAddLineItem} data-secondary-btn className="h-[44px] px-[22px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Line Item</button>
          <button data-secondary-btn className="h-[44px] px-[22px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Another Invoice</button>
          <button onClick={onSave} className="h-[44px] px-[30px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Save</button>
        </div>
      </div>
    </Card>
  );
}

function AddLineItem() {
  const Section = ({ title, fields }: { title: string; fields: [string, string?, string[]?][] }) => (
    <div className="mb-[20px]">
      <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 700 }}>{title}</p>
      <Card className="p-[20px]"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {fields.map(([l, v, opts]) => <Field key={l} label={l} value={v ?? ''} onChange={() => {}} required select={!!opts} options={opts} />)}
      </div></Card>
    </div>
  );
  return (
    <>
      <div className="flex items-center gap-[10px] mb-[10px]">
        <svg viewBox="0 0 24 24" className="size-[20px] text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8" strokeLinecap="round" /></svg>
        <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Add Line Item</p>
      </div>
      <Card className="p-[18px] mb-[18px] grid grid-cols-2 sm:grid-cols-5 gap-[16px]">
        {[['Invoice Number', 'TD 2403'], ['Invoice Date', '09/11/2024'], ['Terms of Delivery', 'Cost & Fright'], ['No. of Line Items', '1 Line Item'], ['Invoice Value', 'USD 6400.00']].map(([k, v]) => <div key={k}><p className="text-[12px] text-[#8f94ae]">{k}</p><p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</p></div>)}
      </Card>
      <Section title="Enter Details" fields={[['HS Code', '07089090'], ['Goods Description', 'Core sand shooting cone'], ['Condition', 'New', ['New', 'Used']], ['Country of Origin', 'New Zealand', ['New Zealand', 'India', 'China']], ['Statistical Quantity', '200'], ['Value of Goods', '2000.90'], ['Weight', '10000'], ['Supplementary Quantity', '200']]} />
      <Section title="IHC Details" fields={[['Item quantity', 'Quantity'], ['Item volume', 'Volume'], ['Classification of goods', 'Quantity', ['Quantity', 'Weight']]]} />
      <Section title="Exemption/Reference Declaration" fields={[['Exemption Type', 'Aircraft', ['Aircraft', 'Vessel']], ['Exemption reference No.', 'R12344667798989'], ['Previous Declaration No.', 'D1234545']]} />
      <Section title="Anti Dumping Details" fields={[['Manufacturer/Exporter', 'OVZ12123 -'], ['Anti Dumping Applicability', 'Not Applicable', ['Not Applicable', 'Applicable']], ['Anti Dumping Exemption Reference No.', 'Reference No'], ['Reason for not- Applicable', '']]} />

      {/* Vehicle Details */}
      <div className="mb-[20px]">
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 700 }}>Vehicle Details</p>
        <Card className="p-[20px]">
          <div className="flex items-center gap-[8px] mb-[16px] bg-white rounded-[6px] p-[4px] w-max" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.12)' }}>
            <button className="text-[14px] px-[16px] py-[8px] rounded-[4px] text-[#5a6282]">Upload Text File</button>
            <button className="text-[14px] px-[16px] py-[8px] rounded-[4px]" style={{ background: '#1360d2', color: '#fff', fontWeight: 500 }}>Add Manually</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {([['Vehicle Brand', 'Honda'], ['Model', 'D12243545'], ['Type', '2WD', ['2WD', '4WD']], ['Drive', 'Right Hand Drive', ['Right Hand Drive', 'Left Hand Drive']], ['Color 1', 'White', ['White', 'Black']], ['Color 2', 'White', ['White', 'Black']], ['Color 3', 'White', ['White', 'Black']], ['Vehicle Color', 'White'], ['Specification std', 'GCC Standard', ['GCC Standard', 'US Standard']], ['Condition', 'New', ['New', 'Used']], ['Chassis No.', 'A234465787B'], ['Engine No.', 'C234465787B'], ['Year Build', 'Year'], ['Engine Capacity', '4 ltr'], ['Passenger Capacity', '5'], ['Carriage Capacity', '5']] as [string, string, string[]?][]).map(([l, v, opts]) => <Field key={l} label={l} value={v} onChange={() => {}} required select={!!opts} options={opts} />)}
          </div>
          <div className="flex items-center gap-[12px] mt-[16px]">
            <button className="h-[42px] px-[26px] rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontWeight: 500 }}>Save</button>
            <button className="h-[42px] px-[22px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Another Vehicle Item</button>
            <button className="h-[42px] px-[22px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Cancel</button>
          </div>
        </Card>
      </div>

      {/* Permit Details */}
      <div className="mb-[20px]">
        <p className="text-[16px] text-[#0e1b3d] mb-[2px]" style={{ fontWeight: 700 }}>Permit Details</p>
        <p className="text-[13px] text-[#5a6282] mb-[12px]">As per your HS code we have found below required permits required for Declaration.</p>
        <Card className="p-[6px]">
          <div className="overflow-x-auto rounded-[8px]"><table className="w-full border-collapse" style={{ minWidth: 640 }}>
            <thead><tr style={{ background: '#eaf1fb' }}>{['Permit Authority', 'Permit Reference No.', 'Permit Not Required', 'Permit Granted'].map(c => <th key={c} className="text-left text-[13px] text-[#455174] px-[16px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}</tr></thead>
            <tbody>
              {[['Dubai Municipality', 'P12345678', true, 'Yes'], ['TDRA', 'P12345678', false, 'No']].map((r, i) => (
                <tr key={i} className="border-t border-[#eef1f6]">
                  <td className="text-[14px] text-[#0e1b3d] px-[16px] py-[14px]">{r[0]}</td>
                  <td className="px-[16px] py-[14px]"><span className="text-[14px] text-[#0e1b3d] px-[10px] py-[6px] rounded-[4px]" style={{ background: '#f4f6fa' }}>{r[1]}</span></td>
                  <td className="px-[16px] py-[14px]"><span className="size-[18px] rounded-[4px] inline-flex items-center justify-center" style={ r[2] ? { background: '#1360d2' } : { border: '1.5px solid #c3cbe0' }}>{r[2] && <svg viewBox="0 0 16 16" className="size-[11px]" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 8l3.5 3.5L13 5" /></svg>}</span></td>
                  <td className="text-[14px] text-[#0e1b3d] px-[16px] py-[14px]">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </Card>
      </div>
    </>
  );
}

/* ── Step 5: Required documents upload ── */
function DocumentsStep() {
  const DOC_TYPES = [
    { label: 'Invoice', required: true },
    { label: 'Packaging List', required: true },
    { label: 'AWB/BOL', required: false },
    { label: 'Laboratory Results', required: false },
    { label: 'Certificate of Origin', required: false },
    { label: 'Other Documents', required: false },
  ];
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  return (
    <>
      <ReadOnlyForm channel="Sea" regime="Import" third={['BOL Number', 'BOL122324']} fourth={['Vessel Information', 'MSK13324']} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] items-start">
        {/* Left: document type selection */}
        <div>
          <h2 className="text-[20px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 700 }}>Required Documents</h2>
          <p className="text-[15px] text-[#5a6282] mb-[16px]">Select the document type to upload</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] mb-[28px]">
            {DOC_TYPES.map((doc, i) => {
              const active = selected === i;
              return (
                <label key={doc.label} onClick={() => setSelected(i)}
                  className="flex items-center gap-[10px] px-[14px] py-[13px] rounded-[6px] cursor-pointer transition-colors"
                  style={{ background: active ? '#f0f5ff' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}>
                  <span className="size-[18px] rounded-full flex-shrink-0 inline-flex items-center justify-center" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                    {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                  </span>
                  <span className="text-[15px]" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                    {doc.required && <span style={{ color: '#ea2428' }}>*</span>}{doc.label}
                  </span>
                </label>
              );
            })}
          </div>

          <h2 className="text-[20px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 700 }}>OGA Required Documents</h2>
          <div className="max-w-[300px]">
            <Field label="" value="" placeholder="Choose Issuing Authorities" select />
          </div>
        </div>

        {/* Right: upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          className="flex flex-col items-center justify-center gap-[16px] rounded-[8px] py-[56px] px-[24px] transition-colors"
          style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#fbfcff', minHeight: 280 }}
        >
          <div className="size-[60px] rounded-full inline-flex items-center justify-center" style={{ background: '#e9eef7' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#8a93a6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
          </div>
          <p className="text-[15px] text-[#5a6282] text-center max-w-[360px]">PDF/excel/JPEG/PNG/ formats can be uploaded. Maximum file size limit 50Mb</p>
          <button data-secondary-btn className="h-[44px] px-[22px] rounded-[6px] border text-[15px] bg-white transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Drag And Drop Or Upload File</button>
        </div>
      </div>
    </>
  );
}

/* ── Step 4: Invoices added + line items ── */
function InvoiceListStep({ onAddLineItem }: { onAddLineItem: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const cols = ['HS Code', 'Goods Description', 'Condition', 'Country of origin', 'Weight', 'Value of Goods', 'Statistical Quantity - Unit', 'Supplementary Quantity/Units', 'Item Quantity', 'Action'];
  const row = ['AX1234567', 'Spare parts', 'New', 'India', '100 kg', 'AED 1500', '100 - Unit', '100', '100 - Unit'];
  return (
    <>
      <ReadOnlyForm channel="Air" regime="Export" third={['AWB Number', 'AWB1234567']} fourth={['Flight Information', 'EK1234']} />

      <h2 className="text-[20px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 700 }}>Invoice Details</h2>
      <p className="text-[15px] text-[#5a6282] mb-[16px]">You can add Cargo details manually or upload a Text file.</p>

      <div className="flex items-center gap-[8px] mb-[16px]">
        <button className="text-[15px] px-[18px] py-[9px] rounded-[4px] border bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Upload Text File</button>
        <button className="text-[15px] px-[18px] py-[9px] rounded-[4px] border bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Add Manually</button>
      </div>

      <div className="flex items-center gap-[24px] mb-[14px]">
        <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>03 Invoices Added</span>
        <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Grand Total: AED 25,000.00</span>
      </div>

      <Card className="p-[20px]">
        {/* Invoice header */}
        <div className="flex items-center justify-between flex-wrap gap-[10px] mb-[16px]">
          <div className="flex items-center gap-[10px]">
            <svg viewBox="0 0 24 24" className="size-[22px] text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" /></svg>
            <span className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Invoice 1</span>
          </div>
          <button onClick={onAddLineItem} data-secondary-btn className="h-[38px] px-[16px] rounded-[4px] border text-[14px] bg-white transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Add Line Item</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-[14px] gap-x-[16px] mb-[8px]">
          {[['Invoice Number', 'TD 2403'], ['Invoice Date', '09/11/2024'], ['Terms of Delivery', 'Cost & Fright'], ['No. of Line Items', '1 Line Item'], ['Invoice Value', 'USD 6400.00']].map(([k, v]) => (
            <div key={k}>
              <p className="text-[13px] text-[#8f94ae]">{k}</p>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-[10px] mb-[10px]">
          <button className="size-[30px] rounded flex items-center justify-center hover:bg-[#f0f4ff]"><svg viewBox="0 0 24 24" className="size-[16px] text-[#697498]" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg></button>
          <button onClick={() => setExpanded((e) => !e)} className="size-[30px] rounded-full border border-[#d5ddfb] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[16px] text-[#697498] transition-transform" style={{ transform: expanded ? 'none' : 'rotate(180deg)' }} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg></button>
        </div>

        {expanded && (
          <>
            <p className="text-[16px] text-[#0e1b3d] mb-[2px]" style={{ fontWeight: 700 }}>Line Items</p>
            <p className="text-[13px] text-[#8f94ae] mb-[12px]">(100 Items Available)</p>
            <div className="pb-[4px]" style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={80} />
              <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto rounded-[8px] border border-[#eef1f6]">
                <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
                  <thead>
                    <tr style={{ background: '#eaf1fb' }}>
                      {cols.slice(0, -1).map((c) => (
                        <th key={c} className="text-left text-[13px] text-[#455174] px-[14px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>
                      ))}
                      <th className="text-left text-[13px] text-[#455174] px-[14px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600, background: '#eaf1fb', position: 'sticky', right: 0, minWidth: 80, width: 80, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>{cols[cols.length - 1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#eef1f6]">
                      {row.map((v, i) => (
                        <td key={i} className="text-[14px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap">{v}</td>
                      ))}
                      <td className="px-[14px] py-[14px]" style={{ background: '#fff', position: 'sticky', right: 0, minWidth: 80, width: 80, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}>
                        <button className="size-[28px] rounded flex items-center justify-center hover:bg-[#f0f4ff]"><svg viewBox="0 0 24 24" className="size-[16px] text-[#697498]" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
