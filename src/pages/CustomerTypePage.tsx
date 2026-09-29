import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TraderIcon, ShippingAgentIcon, AirlineAgentIcon, OtherAgentIcon } from '../components/AgentIcons';

type CardProps = {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function CustomerCard({ label, icon, selected, disabled, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? 'Select Airline Agent to continue' : undefined}
      className={`relative bg-white rounded-[12px] w-full max-w-[230px] h-[220px] flex flex-col items-start justify-between overflow-hidden transition-all
        ${selected
          ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]'
          : disabled
            ? 'border-2 border-[#ddd] opacity-45 cursor-not-allowed'
            : 'border-2 border-[#ddd] hover:border-[#1360d2] hover:shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]'}`}
    >
      <div className="absolute top-0 right-0 w-[64px] h-[64px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[32px] -right-[32px] w-[64px] h-[64px] rounded-full border-[3px] border-[#ea2428]" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full pt-[20px]">
        {icon}
      </div>
      <div className="w-full bg-[#f9f9f9] flex items-center justify-center p-[10px] text-[#0e1b3d] font-medium text-[18px] leading-[20px] text-center capitalize">
        {label}
      </div>
    </button>
  );
}

/**
 * Customer type gate. This build covers the Airline Agent journey only —
 * the other personas are shown for context but are not selectable.
 */
export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('');

  const selectAirline = () => {
    setSelected('airline');
    setTimeout(() => navigate('/landing/airline-agent'), 150);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <div className="bg-white w-full max-w-[1280px] rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-[#0e1b3d] px-6 py-5">
          <h2 className="text-[#f8fafd] font-medium text-[20px]">Customer Type</h2>
        </div>
        <div className="px-12 py-14">
          <h3 className="text-[#0e1b3d] text-[24px] font-semibold text-center mb-3">
            Hi User, Select Your Customer Type to Access the Services
          </h3>
          <p className="text-[#697498] text-[16px] text-center mb-12">
            Select <span className="text-[#1360d2] font-medium">Airline Agent</span> to continue.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-[1080px] mx-auto place-items-center">
            <CustomerCard label="Trader" disabled icon={<TraderIcon size={72} />} />
            <CustomerCard label="Shipping Agent" disabled icon={<ShippingAgentIcon size={72} />} />
            <CustomerCard
              label="Airline Agent"
              selected={selected === 'airline'}
              onClick={selectAirline}
              icon={<AirlineAgentIcon size={72} />}
            />
            <CustomerCard label="Other Agent Type" disabled icon={<OtherAgentIcon size={72} />} />
          </div>
        </div>
      </div>
    </div>
  );
}
