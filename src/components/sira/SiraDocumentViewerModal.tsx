import React, { useEffect } from 'react';
import { font } from './SiraFields';
import type { UploadedDoc } from './siraData';

type Props = {
  docs: UploadedDoc[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

/**
 * Document preview with left / right navigation across every uploaded document.
 * The prototype has no real files, so the sheet renders a representative
 * document layout rather than a fetched binary.
 */
export default function SiraDocumentViewerModal({ docs, index, onIndexChange, onClose }: Props) {
  const doc = docs[index];
  const prev = () => onIndexChange((index - 1 + docs.length) % docs.length);
  const next = () => onIndexChange((index + 1) % docs.length);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  });

  if (!doc) return null;

  const navBtn = 'size-[44px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors';

  return (
    <div className="fixed inset-0 z-[340] flex items-center justify-center p-4" style={{ background: 'rgba(15,18,26,0.88)' }}>
      <div className="w-full max-w-[1000px] max-h-[92vh] bg-white rounded-[8px] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

        {/* Title bar */}
        <div className="bg-[#0b1738] px-[24px] py-[16px] flex items-center justify-between gap-4 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-white text-[18px] font-bold truncate" style={{ fontFamily: font }}>{doc.name}</h2>
            <p className="text-[#b9c6e4] text-[14px]" style={{ fontFamily: font }}>
              {doc.type} · {doc.size} · Uploaded {doc.on}
            </p>
          </div>
          <div className="flex items-center gap-[16px] flex-shrink-0">
            <span className="text-[#b9c6e4] text-[15px] whitespace-nowrap" style={{ fontFamily: font }}>
              {index + 1} of {docs.length}
            </span>
            <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 min-h-0 flex items-center gap-[16px] px-[16px] py-[20px]" style={{ background: '#2b2f38' }}>
          <button onClick={prev} aria-label="Previous document"
            className={`${navBtn} bg-white/15 text-white hover:bg-white/30`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1 min-w-0 h-full overflow-y-auto flex justify-center">
            {/* Representative document sheet */}
            <div className="bg-white w-full max-w-[640px] p-[36px]" style={{ boxShadow: '0 6px 30px rgba(0,0,0,0.4)' }}>
              <div className="flex items-start justify-between gap-4 mb-[26px]">
                <div>
                  <p className="text-[13px] text-[#5a6478] tracking-[1px]" style={{ fontFamily: font }}>GOVERNMENT OF DUBAI</p>
                  <p className="text-[19px] font-bold text-[#0e1b3d] mt-[4px]" style={{ fontFamily: font }}>{doc.type}</p>
                </div>
                <div className="size-[64px] grid grid-cols-4 grid-rows-4 gap-[2px] flex-shrink-0" aria-hidden="true">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} style={{ background: (i * 7 + doc.name.length) % 3 === 0 ? '#0e1b3d' : 'transparent' }} />
                  ))}
                </div>
              </div>

              <div className="bg-[#14614f] text-white text-center py-[8px] mb-[18px]">
                <p className="text-[16px] font-bold" style={{ fontFamily: font }}>{doc.name}</p>
              </div>

              {[
                ['Document Type', doc.type],
                ['File Size', doc.size],
                ['Uploaded On', doc.on],
                ['Issued By', 'Dubai Municipality'],
                ['Reference No.', 'GCP-2026-000148'],
                ['Status', 'Verified'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-[9px]" style={{ borderBottom: '1px solid #eef2fa' }}>
                  <span className="text-[15px] text-[#5a6478]" style={{ fontFamily: font }}>{k}</span>
                  <span className="text-[15px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>{v}</span>
                </div>
              ))}

              <div className="mt-[26px] space-y-[9px]" aria-hidden="true">
                {[100, 92, 96, 78, 88, 64].map((w, i) => (
                  <div key={i} style={{ height: 9, width: `${w}%`, background: '#eef2fa', borderRadius: 2 }} />
                ))}
              </div>
            </div>
          </div>

          <button onClick={next} aria-label="Next document"
            className={`${navBtn} bg-white/15 text-white hover:bg-white/30`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center gap-[8px] overflow-x-auto px-[20px] py-[12px] bg-white flex-shrink-0"
          style={{ borderTop: '1px solid #eef2fa' }}>
          {docs.map((d, i) => (
            <button key={`${d.name}-${i}`} onClick={() => onIndexChange(i)} title={d.name}
              className="px-[12px] py-[8px] rounded-[4px] text-[14px] whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                fontFamily: font,
                border: `1px solid ${i === index ? '#1360d2' : '#e2e8f5'}`,
                background: i === index ? '#e2ebf9' : '#fff',
                color: i === index ? '#1360d2' : '#5a6478',
                fontWeight: i === index ? 600 : 400,
                maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
              {d.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
