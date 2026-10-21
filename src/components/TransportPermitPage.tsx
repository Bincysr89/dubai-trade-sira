import { useState } from 'react';
import Header from './Header';
import { TRANSPORT_ROUTE_OPTIONS, type TransportRouteKey } from './sira/siraData';

type Props = {
  onBack: () => void;
  onHome?: () => void;
  onNext?: () => void;
  initialMethod?: string;
  permitType?: string;
  productCategory?: string;
};

type RouteKey = TransportRouteKey;

type FieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
};

const routeOptions = TRANSPORT_ROUTE_OPTIONS;

export { TRANSPORT_PERMIT_METHODS } from './sira/siraData';

const dubaiPorts = ['Jebel Ali', 'Port Rashid', 'Al Hamriya Port', 'Dubai Harbour'];
const emirates = ['Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

function Field({
  label,
  value = '',
  placeholder,
  required = true,
  disabled,
  options,
  onChange,
}: FieldProps) {
  const fieldClass =
    'h-[48px] w-full rounded-[6px] border border-[#d8deea] bg-white px-[12px] pt-[15px] text-[16px] text-[#111838] outline-none transition-colors focus:border-[#1360d2] disabled:cursor-not-allowed disabled:bg-[#e4e4e4] disabled:text-[#697498]';

  return (
    <label className="relative min-w-0">
      <span className="pointer-events-none absolute left-[12px] top-[4px] z-10 text-[12px] font-medium leading-none text-[#1360d2]">
        {label}
        {required && <span className="text-[#ef5350]"> *</span>}
      </span>
      {options ? (
        <select
          value={value}
          disabled={disabled}
          onChange={event => onChange?.(event.target.value)}
          className={`${fieldClass} appearance-none pr-[36px]`}
        >
          <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={event => onChange?.(event.target.value)}
          className={fieldClass}
        />
      )}
      {options && (
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-[11px] top-[17px] size-[16px] text-[#737b86]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </label>
  );
}

function CoordinateFields({
  showMakani = true,
  initialHasMakani = true,
}: {
  showMakani?: boolean;
  initialHasMakani?: boolean;
}) {
  const [makani, setMakani] = useState('3269285283');
  const [hasMakani, setHasMakani] = useState(initialHasMakani);

  return (
    <>
      {showMakani && (
        <div className="flex min-h-[48px] items-center gap-[22px] rounded-[6px] border border-[#d8deea] bg-white px-[12px]">
          <label className="flex cursor-pointer items-center gap-[7px] text-[14px] text-[#111838]">
            <input
              type="radio"
              checked={hasMakani}
              onChange={() => setHasMakani(true)}
              className="size-[16px] accent-[#1360d2]"
            />
            Makani number
          </label>
          <label className="flex cursor-pointer items-center gap-[7px] text-[14px] text-[#111838]">
            <input
              type="radio"
              checked={!hasMakani}
              onChange={() => setHasMakani(false)}
              className="size-[16px] accent-[#1360d2]"
            />
            No makani number
          </label>
        </div>
      )}
      <Field
        label="Makani number"
        value={hasMakani ? makani : ''}
        disabled={!hasMakani}
        onChange={setMakani}
      />
      {!hasMakani && (
        <button className="h-[48px] rounded-[6px] bg-[#2877c7] px-[22px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90">
          Get co-ordinates
        </button>
      )}
      <Field label="Latitude" value={hasMakani ? '25.17433' : ''} disabled />
      <Field label="Longitude" value={hasMakani ? '55.3398' : ''} disabled />
    </>
  );
}

function RouteFields({ route }: { route: RouteKey }) {
  if (route === 'dubai-port') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="To Dubai port" value="Port Rashid" options={dubaiPorts} />
      </>
    );
  }

  if (route === 'dubai-storage') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="To Dubai storage" value="BAB AL SHAMS CHEMICALS" options={['BAB AL SHAMS CHEMICALS', 'RAS AL KHOR INDUSTRIAL STORAGE']} />
        <Field label="Address" value="RAS AL KHOR INDUSTRIAL AREA" />
        <CoordinateFields showMakani={false} />
      </>
    );
  }

  if (route === 'dubai-event') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="Destination name" placeholder="Enter destination name" />
        <Field label="Address" placeholder="Enter address" />
        <CoordinateFields />
      </>
    );
  }

  if (route === 'emirates-port') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="To emirates" value="Abu Dhabi" options={emirates} />
        <Field label="Destination port" value="Khalifa Port" options={['Khalifa Port', 'Zayed Port', 'Fujairah Port', 'Khor Fakkan Port']} />
      </>
    );
  }

  if (route === 'emirates-storage') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="To emirates" value="Abu Dhabi" options={emirates} />
        <Field label="To storage" placeholder="Search storage" />
        <Field label="Address" placeholder="Enter address" />
        <CoordinateFields showMakani={false} />
      </>
    );
  }

  if (route === 'emirates-event') {
    return (
      <>
        <Field label="From Dubai port" value="Jebel Ali" options={dubaiPorts} />
        <Field label="To emirates" value="Abu Dhabi" options={emirates} />
        <Field label="Destination name" placeholder="Enter destination name" />
        <Field label="Address" placeholder="Enter address" />
        <CoordinateFields />
      </>
    );
  }

  return (
    <>
      <Field label="From emirates" value="Abu Dhabi" options={emirates} />
      <Field label="Destination name" placeholder="Enter event place" />
      <Field label="Address" placeholder="Enter address" />
      <Field label="To Dubai port" value="Jebel Ali" options={dubaiPorts} />
      <CoordinateFields initialHasMakani={false} />
    </>
  );
}

const itemRows = Array.from({ length: 6 }, (_, index) => index + 1);

function PermitTable() {
  return (
    <div className="min-h-0 flex-1 overflow-auto border-y border-[#d7dbe3]">
      <table className="w-full min-w-[1120px] border-collapse text-left text-[14px]">
        <thead className="sticky top-0 z-10 bg-[#2877c7] text-white">
          <tr>
            {['S.No', 'Item Name', 'HS Code', 'Goods Description', 'Goods Value', 'Purpose of Use', 'Country of Origin', 'Quantity'].map((heading, index) => (
              <th
                key={heading}
                className={`h-[38px] px-[12px] font-semibold ${index === 0 ? 'w-[64px]' : ''}`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemRows.map(row => (
            <tr key={row} className="odd:bg-white even:bg-[#f0f1f2]">
              <td className="h-[54px] px-[14px] text-[#111838]">
                <span className="mr-[14px]">{row}</span>
                <span className="text-[18px] text-[#59616b]">≡</span>
              </td>
              {Array.from({ length: 7 }, (_, column) => (
                <td key={column} className="h-[54px] px-[10px]">
                  <button
                    className="flex h-[38px] w-full items-center justify-between rounded-[4px] px-[8px] text-[#697498] hover:bg-[#e6edf8]"
                    aria-label={`Choose ${column + 1} for row ${row}`}
                  >
                    <span />
                    <svg viewBox="0 0 20 20" className="size-[14px]" fill="currentColor">
                      <path d="m5 7 5 5 5-5H5Z" />
                    </svg>
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfirmationModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(20,27,39,0.72)] p-4">
      <div className="relative w-full max-w-[500px] rounded-[8px] bg-white px-[30px] pb-[28px] pt-[34px] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <button
          onClick={onClose}
          className="absolute right-[18px] top-[16px] text-[#5a6478] hover:text-[#111838]"
          aria-label="Close confirmation"
        >
          <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="mx-auto mb-[18px] flex size-[62px] items-center justify-center rounded-full bg-[#fff1c7]">
          <div className="flex size-[42px] items-center justify-center rounded-full bg-[#f4b52f] text-[24px] font-bold text-white">!</div>
        </div>
        <h2 className="mb-[10px] text-center text-[21px] font-bold text-[#111838]">Confirmation</h2>
        <p className="mb-[24px] text-center text-[16px] leading-[25px] text-[#5a6478]">
          Please confirm that the transport permit request information is complete and correct before submitting.
        </p>
        <div className="flex gap-[18px]">
          <button
            onClick={onConfirm}
            className="h-[46px] flex-1 rounded-[4px] bg-[#1360d2] text-[16px] font-semibold text-white hover:bg-[#0f55bd]"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="h-[46px] flex-1 rounded-[4px] border border-[#dc3545] bg-white text-[16px] font-medium text-[#dc3545] hover:bg-[#fff4f4]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(20,27,39,0.72)] p-4">
      <div className="relative w-full max-w-[500px] rounded-[8px] bg-white px-[30px] pb-[28px] pt-[34px] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mb-[18px] flex size-[66px] items-center justify-center rounded-full bg-[#d9f2e5]">
          <div className="flex size-[46px] items-center justify-center rounded-full bg-[#20a464]">
            <svg viewBox="0 0 24 24" className="size-[25px]" fill="none" stroke="white" strokeWidth="2.5">
              <path d="m5 12 4.2 4.2L19 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h2 className="mb-[10px] text-center text-[21px] font-bold text-[#111838]">Request submitted successfully</h2>
        <p className="mb-[8px] text-center text-[16px] leading-[25px] text-[#5a6478]">
          Your SIRA transport permit request has been submitted for review.
        </p>
        <p className="mb-[24px] text-center text-[18px] font-semibold text-[#1360d2]">TPR-2026-10482</p>
        <button
          onClick={onDone}
          className="h-[46px] w-full rounded-[4px] bg-[#1360d2] text-[16px] font-semibold text-white hover:bg-[#0f55bd]"
        >
          Back to Service Catalogue
        </button>
      </div>
    </div>
  );
}

export default function TransportPermitPage({
  onBack,
  onHome,
  onNext,
  initialMethod,
  permitType = 'Hazardous Goods',
  productCategory = 'Airguns And Accessories',
}: Props) {
  const initialRoute = routeOptions.find(option => option.label === initialMethod)?.value ?? 'dubai-port';
  const [route, setRoute] = useState<RouteKey>(initialRoute);
  const [invoice, setInvoice] = useState('12545');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const selectedMethod = routeOptions.find(option => option.value === route)?.label ?? routeOptions[0].label;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#f8fafd] font-['Dubai',sans-serif]">
      <div className="shrink-0">
        <Header onHome={onHome ?? onBack} />
      </div>

      <main className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-[4px] py-[14px] text-[16px]">
          <button onClick={onHome ?? onBack} className="text-[#8f94ae] hover:text-[#1360d2]">Home</button>
          <span className="px-[4px] text-[#dc3545]">/</span>
          <button onClick={onBack} className="text-[#8f94ae] hover:text-[#1360d2]">Service Catalogue</button>
          <span className="px-[4px] text-[#dc3545]">/</span>
          <span className="font-medium text-[#111838]">SIRA - Transport Permit</span>
        </div>

        <div className="mb-[14px] flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold leading-tight text-[#0e1b3d]">
              Transport Permit <span className="text-[#1360d2]">→ {selectedMethod}</span>
            </h1>
            <p className="mt-[4px] text-[15px] text-[#697498]">{permitType} - {productCategory}</p>
          </div>
          <button
            onClick={onBack}
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-[#d9dfeb] bg-white text-[#0e1b3d] hover:bg-[#eef3fb]"
            aria-label="Close Transport Permit"
          >
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] border border-[#d8deea] bg-white shadow-[0_4px_18px_rgba(143,155,186,0.16)]">
          <div className="flex h-[42px] shrink-0 items-center justify-between bg-[#1675de] px-[14px] text-white">
            <div className="flex items-center gap-[9px] text-[17px] font-semibold">
              <svg viewBox="0 0 28 20" className="h-[20px] w-[28px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 14V8h16v6M18 10h4l4 4v2h-3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 16h12M2 16h1M20 16h1" />
                <circle cx="5" cy="16" r="2" /><circle cx="20" cy="16" r="2" />
                <path d="M6 8V4h8l4 4" />
              </svg>
              {permitType} - {productCategory} - Transport Permit Request
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-[6px] p-[6px] sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Importer / Company name" value="ANBU RAJ" disabled />
            <label className="relative min-w-0">
              <span className="pointer-events-none absolute left-[12px] top-[4px] z-10 text-[12px] font-medium leading-none text-[#1360d2]">
                Transport permit method <span className="text-[#ef5350]">*</span>
              </span>
              <select
                value={route}
                onChange={event => setRoute(event.target.value as RouteKey)}
                className="h-[48px] w-full appearance-none rounded-[6px] border border-[#d8deea] bg-white px-[12px] pt-[15px] pr-[36px] text-[16px] text-[#111838] outline-none focus:border-[#1360d2]"
              >
                {routeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-[11px] top-[17px] size-[16px] text-[#737b86]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            <RouteFields route={route} />
            <Field label="Sending date & time" value="06 Oct 2026 02:58 PM" />
            <Field label="Shipping invoice number" value={invoice} onChange={setInvoice} />
          </div>

          <PermitTable />

          <div className="flex shrink-0 items-center justify-between border-t border-[#d8deea] bg-white px-[10px] py-[10px]">
            <button
              onClick={onBack}
              className="h-[42px] rounded-[4px] border border-[#1360d2] bg-white px-[28px] text-[16px] font-medium text-[#1360d2] hover:bg-[#f0f4ff]"
            >
              Back
            </button>
            <button
              onClick={() => setConfirmationOpen(true)}
              className="flex h-[42px] items-center gap-[8px] rounded-[4px] bg-[#2877c7] px-[24px] text-[16px] font-semibold text-white hover:bg-[#1f68b3]"
            >
              Next
              <span className="flex size-[18px] items-center justify-center rounded-full bg-white text-[#2877c7]">›</span>
            </button>
          </div>
        </section>
      </main>

      {confirmationOpen && (
        <ConfirmationModal
          onClose={() => setConfirmationOpen(false)}
          onConfirm={() => {
            setConfirmationOpen(false);
            if (onNext) onNext();
            else setSubmitted(true);
          }}
        />
      )}
      {submitted && <SuccessModal onDone={onBack} />}
    </div>
  );
}
