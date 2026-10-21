import { useState } from 'react';
import SiraAttachmentsPage from './SiraAttachmentsPage';
import SiraJourneyPage, { type JourneyValues } from './SiraJourneyPage';
import SiraListingPage from './SiraListingPage';
import SiraRequestDetailsPage from './SiraRequestDetailsPage';
import SiraSuccessPage from './SiraSuccessPage';
import SiraViewRequestPage from './SiraViewRequestPage';
import { GOODS_CONTROL_PERMIT, TRANSPORT_PERMIT_METHODS, type SiraRow } from './siraData';

const TRANSPORT_DOCS = [
  { label: 'Passport',              required: true },
  { label: 'Emirates ID Card',      required: true },
  { label: 'Performa Invoice',      required: true },
  { label: 'Packing List',          required: true },
  { label: 'Customs Declaration',   required: true },
  { label: 'Goods Specifications',  required: true },
  { label: 'Visa',                  required: false, optional: true },
  { label: 'Payment Slip Proof',    required: false },
];

type Props = {
  onClose: () => void;
};

type Step = 'listing' | 'journey' | 'request' | 'attachments' | 'success' | 'view';

const DEFAULT_JOURNEY: JourneyValues = {
  permitType: GOODS_CONTROL_PERMIT,
  requestType: 'Transit Permit',
  productCategory: 'Drone',
  transportationMethod: TRANSPORT_PERMIT_METHODS[0],
  bolAwbNumber: '',
};

const TRANSPORT_ROWS: SiraRow[] = [
  ['TPR-2026-10482', TRANSPORT_PERMIT_METHODS[0], 'Submitted'],
  ['TPR-2026-10471', TRANSPORT_PERMIT_METHODS[1], 'Payment Pending'],
  ['TPR-2026-10463', TRANSPORT_PERMIT_METHODS[2], 'Approved'],
  ['TPR-2026-10454', TRANSPORT_PERMIT_METHODS[3], 'More Info Required'],
  ['TPR-2026-10439', TRANSPORT_PERMIT_METHODS[4], 'Draft'],
  ['TPR-2026-10428', TRANSPORT_PERMIT_METHODS[5], 'Cleared'],
  ['TPR-2026-10411', TRANSPORT_PERMIT_METHODS[6], 'Rejected'],
].map(([requestNo, route, status], index) => ({
  requestNo,
  permitType: 'Transport Permit',
  requestType: route,
  paymentAdviceNo: index === 1 ? 'TPA-2026-79341' : '—',
  importPermitNo: `SIRA-IMP-458${24 + index}`,
  fromStorage: index === 4 ? 'Dubai South' : 'Jebel Ali Port',
  toPort: index === 2 ? 'Dubai Exhibition Centre' : index === 3 ? 'Khalifa Port' : 'Port Rashid',
  statusDateTime: `8/${17 - index}/2026 10:4${index}`,
  requestDateTime: `8/${15 - index}/2026 09:1${index}`,
  status: status as SiraRow['status'],
  productCategory: 'Airguns And Accessories',
  bolAwbNo: `BOL13243${20 + index}`,
  licenseNo: `A1234568${90 + index}`,
}));

export default function SiraTransportPermitFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>('listing');
  const [journey, setJourney] = useState<JourneyValues>(DEFAULT_JOURNEY);
  const [permitType, setPermitType] = useState(DEFAULT_JOURNEY.permitType);
  const [productCategory, setProductCategory] = useState(DEFAULT_JOURNEY.productCategory);
  /* The row opened read-only from the listing. */
  const [viewRow, setViewRow] = useState<SiraRow | null>(null);
  const backToListing = () => setStep('listing');

  if (step === 'view' && viewRow) {
    return (
      <SiraViewRequestPage
        row={viewRow}
        serviceLabel="SIRA - Transport Permit"
        transportPermit
        onBackToListing={backToListing}
        onHome={onClose}
        onAmend={() => setStep('request')}
      />
    );
  }

  if (step === 'journey') {
    return (
      <SiraJourneyPage
        serviceTitle="Transport Permit"
        breadcrumbLabel="SIRA - Transport Permit"
        initialValues={journey}
        transportPermitMethods={TRANSPORT_PERMIT_METHODS}
        onBack={backToListing}
        onHome={onClose}
        onProceed={values => {
          setJourney(values);
          setPermitType(values.permitType);
          setProductCategory(values.productCategory);
          setStep('request');
        }}
      />
    );
  }

  if (step === 'request') {
    return (
      <SiraRequestDetailsPage
        journey={journey}
        serviceLabel="SIRA - Transport Permit"
        titleFor={(_, category) => `Transport Permit Request - ${category}`}
        transportPermitMethods={TRANSPORT_PERMIT_METHODS}
        onBack={() => setStep('journey')}
        onHome={onClose}
        onNext={(type, category) => {
          setPermitType(type);
          setProductCategory(category);
          setStep('attachments');
        }}
      />
    );
  }

  if (step === 'attachments') {
    return (
      <SiraAttachmentsPage
        permitType={permitType}
        productCategory={productCategory}
        serviceLabel="SIRA - Transport Permit"
        docOptions={TRANSPORT_DOCS}
        hideDocDetails
        pageTitle={`Transport Permit Request - ${permitType} ${productCategory}`}
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
        serviceLabel="SIRA - Transport Permit"
        journeyTitle="Transport Permit Request Completed"
        journeySubtitle="Your SIRA transport permit request has been submitted for review"
        successTitle="Transport Permit Submitted Successfully"
        successLines={[
          'Dear Customer, thank you for using the Dubai Trade Permit application.',
          'Your SIRA transport permit request has been submitted to Dubai Police.',
          'Please keep the reference number below to track the request from the listing.',
        ]}
        referenceNumber="TPR-2026-10482"
        proceedLabel={null}
        onBackToListing={backToListing}
        onHome={onClose}
        onProceedToDeclaration={onClose}
      />
    );
  }

  return (
    <SiraListingPage
      serviceTitle="Transport Permit"
      breadcrumbLabel="SIRA - Transport Permit"
      rows={TRANSPORT_ROWS}
      transportPermitMethods={TRANSPORT_PERMIT_METHODS}
      onClose={onClose}
      onStartJourney={() => setStep('journey')}
      onViewRequest={row => { setViewRow(row); setStep('view'); }}
    />
  );
}
