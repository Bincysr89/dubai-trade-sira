import React, { useState } from 'react';
import Header from '../Header';
import { font, SiraCard, SiraSelect, SiraInput, SiraRadioGroup } from './SiraFields';
import {
  REQUEST_TYPES, TRANSPORTATION_METHODS, SIRA_SERVICE_TITLE,
  PERMIT_TYPES, HAZARDOUS_GOODS_PERMIT, categoriesFor,
} from './siraData';
import { CATEGORY_ICONS } from './SiraCategoryIcons';

export type JourneyValues = {
  permitType: string;
  requestType: string;
  productCategory: string;
  transportationMethod: string;
  bolAwbNumber: string;
};

type Props = {
  onBack: () => void;
  onHome: () => void;
  onProceed: (v: JourneyValues) => void;
};

/* ── Help & Guides tabs ── */
const TABS = [
  {
    key: 'information', label: 'Information',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'tutorials', label: 'Tutorials',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'faqs', label: "Common FAQ's",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M21 11.5a8.4 8.4 0 01-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1121 11.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'updates', label: 'Updates',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M21 12a9 9 0 11-2.6-6.4M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'downloads', label: 'Downloads',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3v12M7 11l5 5 5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PROCEDURE = [
  { n: 1, title: 'Request Submission', desc: 'Fill the request information like, regime type, declaration Type, cargo channel etc.' },
  { n: 2, title: 'Invoice Details',    desc: 'Upload or add manually the invoice and HS code details of the cargo.' },
  { n: 3, title: 'Document Upload',    desc: 'Upload all the relevant documents required for customs and permit clearance.' },
  { n: 4, title: 'Pay & Submit',       desc: 'Review the charges, settle the payment and submit the request to SIRA.' },
];

const FAQS = [
  { q: 'Who needs a Goods Control Permit?', a: 'Any importer, exporter or agent moving controlled or hazardous goods through Dubai must hold a valid SIRA Goods Control Permit before the consignment is cleared.' },
  { q: 'How long does approval take?', a: 'Standard requests are reviewed within 2 working days. Requests flagged for inspection may take up to 5 working days.' },
  { q: 'Can I amend a submitted request?', a: 'Yes — until the request is approved. Use the Actions menu on the listing and choose "More Info Required" to supply additional details.' },
];

const DOWNLOADS = [
  'Goods Control Permit — User Manual (PDF)',
  'HS Code bulk upload template (.TXT)',
  'Required documents checklist (PDF)',
];

const UPDATES = [
  { date: '12 Sep 2026', text: 'Bulk HS-code upload now supports files up to 50 MB.' },
  { date: '02 Aug 2026', text: 'Transit via Type "Multiple" lets you record a full multi-leg route.' },
  { date: '18 Jun 2026', text: 'Payment advice is now generated immediately on submission.' },
];

export default function SiraJourneyPage({ onBack, onHome, onProceed }: Props) {
  const [values, setValues] = useState<JourneyValues>({
    permitType: HAZARDOUS_GOODS_PERMIT,
    requestType: 'Import Permit',
    productCategory: 'Chemical Materials',
    transportationMethod: 'Sea Freight',
    bolAwbNumber: 'BOL1211324',
  });
  const [tab, setTab] = useState('information');
  const set = (k: keyof JourneyValues, v: string) => setValues(p => ({ ...p, [k]: v }));
  /* Switching permit type re-scopes the product category list. */
  const setPermitType = (permitType: string) => setValues(p => ({
    ...p, permitType, productCategory: categoriesFor(permitType)[0],
  }));
  const categories = categoriesFor(values.permitType);

  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header onHome={onHome} />
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-8">
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
            A180-IMPORTER SONY GULF UAE
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-[#0e1b3d] mb-[18px]" style={{ fontFamily: font }}>
          {SIRA_SERVICE_TITLE}
        </h1>

        {/* Request Information + Proceed */}
        <SiraCard title="Request Information">
          {/* Permit type decides which product categories apply */}
          <div className="mb-[26px]">
            <SiraRadioGroup label="Permit Type" value={values.permitType} options={PERMIT_TYPES} onChange={setPermitType} />
          </div>

          <div className="flex gap-[20px] items-end flex-wrap lg:flex-nowrap">
            <div className="flex-1 min-w-[200px]">
              <SiraSelect label="Request Type" value={values.requestType} options={REQUEST_TYPES}
                onChange={v => set('requestType', v)} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <SiraSelect label="Product Category" value={values.productCategory} options={categories}
                onChange={v => set('productCategory', v)} optionIcons={CATEGORY_ICONS} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <SiraSelect label="Transportation Method" value={values.transportationMethod} options={TRANSPORTATION_METHODS}
                onChange={v => set('transportationMethod', v)} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <SiraInput label="BOL/ AWB Number" value={values.bolAwbNumber} onChange={v => set('bolAwbNumber', v)} />
            </div>
            <button
              onClick={() => onProceed(values)}
              className="h-[56px] px-[42px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}
            >
              Proceed
            </button>
          </div>
        </SiraCard>

        {/* Help and Guides */}
        <div className="flex items-center gap-[12px] mt-[32px] mb-[18px]">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0e1b3d" strokeWidth="1.6">
            <path d="M3 5.5A1.5 1.5 0 014.5 4H9a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5H3V5.5z" strokeLinejoin="round" />
            <path d="M21 5.5A1.5 1.5 0 0019.5 4H15a3 3 0 00-3 3v13a2.5 2.5 0 012.5-2.5H21V5.5z" strokeLinejoin="round" />
          </svg>
          <h2 className="text-[24px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Help and Guides</h2>
        </div>

        <div className="flex items-center gap-[10px] border-b border-[#e2e8f5] mb-[26px] overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-[10px] px-[18px] pb-[14px] pt-[6px] text-[16px] whitespace-nowrap transition-colors flex-shrink-0"
                style={{
                  fontFamily: font,
                  color: active ? '#1360d2' : '#5a6478',
                  fontWeight: active ? 600 : 400,
                  borderBottom: active ? '3px solid #1360d2' : '3px solid transparent',
                  marginBottom: -1,
                }}>
                <span style={{ color: active ? '#1360d2' : '#5a6478' }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'information' && (
          <div className="pb-[20px]">
            <h3 className="text-[20px] font-bold text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font }}>About the Service</h3>
            <p className="text-[16px] text-[#3f4d66] leading-[26px] mb-[6px]" style={{ fontFamily: font }}>
              Integrated Clearance is a service that enables customers to complete the entire customs clearance process,
              including obtaining permits from the relevant issuing authorities.
            </p>
            <p className="text-[16px] text-[#3f4d66] mb-[34px]" style={{ fontFamily: font }}>
              View the declaration assistant. <a className="text-[#1360d2] underline cursor-pointer">Click here</a>
            </p>

            <h3 className="text-[20px] font-bold text-[#0e1b3d] mb-[18px]" style={{ fontFamily: font }}>Service Delivery Procedure</h3>
            <div className="flex items-stretch gap-0 flex-wrap xl:flex-nowrap">
              {PROCEDURE.map((p, i) => (
                <React.Fragment key={p.n}>
                  <div className="bg-white rounded-[8px] p-[20px] flex-1 min-w-[240px]"
                    style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                    <span className="size-[30px] rounded-full bg-[#12b76a] text-white text-[15px] font-bold flex items-center justify-center mb-[18px]"
                      style={{ fontFamily: font }}>{p.n}</span>
                    <p className="text-[17px] font-bold text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font }}>{p.title}</p>
                    <p className="text-[15px] text-[#5a6478] leading-[24px]" style={{ fontFamily: font }}>{p.desc}</p>
                  </div>
                  {i < PROCEDURE.length - 1 && (
                    <div className="hidden xl:flex items-center flex-shrink-0 px-[8px]">
                      <span style={{ width: 48, height: 2, background: '#b9e6cd', display: 'block' }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {tab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] pb-[20px]">
            {['Submitting your first NOC request', 'Adding HS code line items', 'Paying a payment advice'].map(t => (
              <div key={t} className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <div className="h-[140px] bg-[#e2ebf9] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#1360d2" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4V8z" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[16px] font-medium text-[#0e1b3d] p-[16px]" style={{ fontFamily: font }}>{t}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'faqs' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {FAQS.map(f => (
              <div key={f.q} className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <p className="text-[17px] font-bold text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font }}>{f.q}</p>
                <p className="text-[15px] text-[#5a6478] leading-[24px]" style={{ fontFamily: font }}>{f.a}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'updates' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {UPDATES.map(u => (
              <div key={u.date} className="bg-white rounded-[8px] p-[18px] flex gap-[18px] items-start"
                style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <span className="text-[15px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{u.date}</span>
                <span className="text-[16px] text-[#3f4d66]" style={{ fontFamily: font }}>{u.text}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'downloads' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {DOWNLOADS.map(d => (
              <div key={d} className="bg-white rounded-[8px] p-[18px] flex items-center justify-between gap-[16px]"
                style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d}</span>
                <button className="flex items-center gap-[8px] text-[16px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.8">
                    <path d="M12 3v12M7 11l5 5 5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-white flex items-center px-[40px] py-[16px] flex-shrink-0"
        style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
        <button onClick={onBack} data-secondary-btn
          className="h-[48px] px-[42px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
          style={{ fontFamily: font, fontWeight: 500 }}>
          Back
        </button>
      </div>
    </div>
  );
}
