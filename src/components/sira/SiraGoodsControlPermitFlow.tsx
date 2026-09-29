import React, { useState } from 'react';
import SiraListingPage from './SiraListingPage';
import SiraJourneyPage, { type JourneyValues } from './SiraJourneyPage';
import SiraRequestDetailsPage from './SiraRequestDetailsPage';
import SiraAttachmentsPage from './SiraAttachmentsPage';
import SiraSuccessPage from './SiraSuccessPage';
import { HAZARDOUS_GOODS_PERMIT } from './siraData';

type Props = {
  /** Return to whatever opened the service (landing page / catalogue / permits). */
  onClose: () => void;
};

type Step = 'listing' | 'journey' | 'request' | 'attachments' | 'success';

const DEFAULT_JOURNEY: JourneyValues = {
  permitType: HAZARDOUS_GOODS_PERMIT,
  requestType: 'Import Permit',
  productCategory: 'Chemical Materials',
  transportationMethod: 'Sea Freight',
  bolAwbNumber: 'BOL1211324',
};

/**
 * SIRA — Goods Control Permit.
 * Listing → Start Journey → Request Details → Attachments → Pay & Submit → Success.
 */
export default function SiraGoodsControlPermitFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>('listing');
  const [journey, setJourney] = useState<JourneyValues>(DEFAULT_JOURNEY);
  /* Permit type + category chosen on the Request Details step — they title the later steps. */
  const [permitType, setPermitType] = useState(DEFAULT_JOURNEY.permitType);
  const [productCategory, setProductCategory] = useState(DEFAULT_JOURNEY.productCategory);

  const backToListing = () => setStep('listing');

  if (step === 'journey') {
    return (
      <SiraJourneyPage
        onBack={backToListing}
        onHome={onClose}
        onProceed={v => { setJourney(v); setStep('request'); }}
      />
    );
  }

  if (step === 'request') {
    return (
      <SiraRequestDetailsPage
        journey={journey}
        onBack={() => setStep('journey')}
        onHome={onClose}
        onNext={(type, cat) => { setPermitType(type); setProductCategory(cat); setStep('attachments'); }}
      />
    );
  }

  if (step === 'attachments') {
    return (
      <SiraAttachmentsPage
        permitType={permitType}
        productCategory={productCategory}
        onBack={() => setStep('request')}
        onHome={onClose}
        onPaid={() => setStep('success')}
        onPayLater={backToListing}
      />
    );
  }

  if (step === 'success') {
    return (
      <SiraSuccessPage
        onBackToListing={backToListing}
        onHome={onClose}
        onProceedToDeclaration={onClose}
      />
    );
  }

  return (
    <SiraListingPage
      onClose={onClose}
      onStartJourney={() => setStep('journey')}
      onViewRequest={() => setStep('request')}
    />
  );
}
