import React from 'react';
import Header from '../Header';
import JourneyProgress from '../JourneyBanner';
import { font } from './SiraFields';

type Props = {
  onBackToListing: () => void;
  onHome: () => void;
  onProceedToDeclaration: () => void;
  referenceNumber?: string;
};

export default function SiraSuccessPage({
  onBackToListing, onHome, onProceedToDeclaration, referenceNumber = '12345678',
}: Props) {
  const proceedBtn = (
    <button
      onClick={onProceedToDeclaration}
      className="h-[48px] px-[26px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
      style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}
    >
      Proceed To Customs Declaration
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[4px] text-[16px] mt-[16px] mb-[14px]" style={{ fontFamily: font }}>
          <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onHome}>Home</span>
          <span className="text-[#dc3545] px-[4px]">/</span>
          <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBackToListing}>Service Catalog</span>
          <span className="text-[#dc3545] px-[4px]">/</span>
          <span className="text-[#111838] font-medium">SIRA - Goods Control Permit</span>
        </div>

        <JourneyProgress
          active={1}
          percent={45}
          title="Import Permit Request Completed"
          subtitle="Click on 'Continue' to move to the next step for Import Process"
          button={proceedBtn}
        />

        {/* Success card */}
        <div className="bg-white rounded-[8px] py-[58px] px-[24px] flex flex-col items-center"
          style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
          <span className="size-[120px] rounded-full flex items-center justify-center mb-[34px]"
            style={{ background: 'rgba(40,167,69,0.22)' }}>
            <span className="size-[84px] rounded-full flex items-center justify-center" style={{ background: '#16a34a' }}>
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#fff" strokeWidth="2.6">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>

          <h2 className="text-[30px] font-bold text-[#0e1b3d] mb-[24px] text-center" style={{ fontFamily: font }}>
            NOC Submitted Successfully
          </h2>

          <div className="text-[16px] text-[#5a6478] text-center leading-[28px] mb-[30px]" style={{ fontFamily: font }}>
            <p>Dear Customer, thank you for using the Dubai Trade Permit application.</p>
            <p>Your request has been submitted to Dubai Police.</p>
            <p>Please note your reference number and proceed with the payment to complete the request.</p>
          </div>

          <div className="flex items-center gap-[12px] mb-[20px]">
            <span className="text-[16px] text-[#5a6478]" style={{ fontFamily: font }}>Permit Status:</span>
            <span className="inline-flex items-center px-[14px] py-[4px] rounded-[4px] text-[16px] font-medium"
              style={{ background: 'rgba(255,169,26,0.20)', color: '#b45309', fontFamily: font }}>
              Submitted
            </span>
          </div>

          <div className="px-[22px] py-[10px] rounded-[4px] border border-[#e2e8f5] bg-white text-[16px] text-[#5a6478]"
            style={{ fontFamily: font }}>
            Reference number: <span className="text-[#1360d2] font-medium">{referenceNumber}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white flex items-center justify-between px-[40px] py-[16px] flex-shrink-0 gap-4 flex-wrap"
        style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
        <button onClick={onBackToListing} data-secondary-btn
          className="h-[48px] px-[30px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
          style={{ fontFamily: font, fontWeight: 500 }}>
          Back&nbsp; To Listing
        </button>
        {proceedBtn}
      </div>
    </div>
  );
}
