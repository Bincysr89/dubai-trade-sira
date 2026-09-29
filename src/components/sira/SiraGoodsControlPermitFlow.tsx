import React, { useState } from 'react';
import SiraListingPage from './SiraListingPage';
import SiraJourneyPage, { type JourneyValues } from './SiraJourneyPage';
import SiraRequestDetailsPage from './SiraRequestDetailsPage';
import SiraAttachmentsPage from './SiraAttachmentsPage';
import SiraSuccessPage from './SiraSuccessPage';

type Props = {
  /** Return to whatever opened the service (landing page / catalogue / permits). */
  onClose: () => void;
};

type Step = 'listing' | 'journey' | 'request' | 'attachments' | 'success';

const DEFAULT_JOURNEY: JourneyValues = {
  requestType: 'Import Permit',
  productCategory: 'Hazardous Goods',
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
  /* Category chosen on the Request Details step — titles the later steps. */
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
        onNext={cat => { setProductCategory(cat); setStep('attachments'); }}
      />
    );
  }

  if (step === 'attachments') {
    return (
      <SiraAttachmentsPage
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
