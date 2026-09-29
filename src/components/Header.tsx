import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Logo from './Logo';
import ServiceCatalogueModal from './ServiceCatalogueModal';
import homeIconSrc from '../assets/icon-home.svg';
import { setAuthenticated } from '../auth';

type Props = {
  onServiceCatalogue?: () => void;
  onHome?: () => void;
  /** Set when this Header is inside the Service Catalogue itself — the button then
   *  closes the catalogue (via onServiceCatalogue) instead of opening a new one. */
  catalogueClosesOnClick?: boolean;
};

export default function Header({ onServiceCatalogue, onHome, catalogueClosesOnClick }: Props) {
  const navigate = useNavigate();
  const { agent } = useParams<{ agent?: string }>();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const goHome = () => {
    if (onHome) onHome();
    else navigate(`/landing/${agent ?? 'trader'}`);
  };

  // "Service Catalogue" opens the catalogue overlay from any page. Inside the
  // catalogue itself it closes instead (so it doesn't stack another copy).
  const openServiceCatalogue = () => {
    if (catalogueClosesOnClick) onServiceCatalogue?.();
    else setCatalogueOpen(true);
  };

  useEffect(() => {
    if (!profileOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-[#0e1b3d] w-full shadow-[0_2px_32px_0_rgba(0,0,0,0.08)] sticky top-0 z-40">
      <div className="w-full h-[88px] px-3 sm:px-8 lg:px-[60px] flex items-center justify-between gap-3 sm:gap-6 min-w-0">
        <Link to="/customer-type" className="flex-shrink-0 min-w-0">
          <Logo height={48} white className="!h-[34px] sm:!h-[48px] w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-[20px] text-white text-[15px]">
          <button onClick={goHome} className="hover:opacity-80 size-[24px]" aria-label="Home">
            <img src={homeIconSrc} alt="Home" className="size-[24px]" />
          </button>
          <button className="hover:opacity-80" onClick={openServiceCatalogue}>Service Catalogue</button>
          <button className="hover:opacity-80 flex items-center gap-1">
            Trade Service Providers
            <svg viewBox="0 0 16 16" className="size-[14px]" fill="currentColor"><path d="M4 6l4 4 4-4z" /></svg>
          </button>
          <button className="hover:opacity-80">Take a Tour</button>
          <button className="hover:opacity-80">Knowledge Hub</button>
        </nav>

        <div className="flex items-center gap-[6px] sm:gap-[10px] flex-shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex lg:hidden size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] items-center justify-center text-white hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] hidden sm:flex items-center justify-center text-white hover:bg-white/10">
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
          </button>
          <div className="relative">
            <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] flex items-center justify-center text-white hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
            </button>
            <span className="absolute -top-1 -right-1 bg-[#dc3545] border-2 border-[#051937] rounded-full size-[20px] text-white text-[10px] font-medium flex items-center justify-center">5</span>
          </div>
          <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] hidden sm:flex items-center justify-center text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="4" r="2" /><path d="M19 13l-2-2-5 1-5-1-2 2 4 2v8h2v-5h2v5h2v-8z" /></svg>
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="bg-[#455174] rounded-[8px] h-[44px] px-2 flex items-center gap-2 hover:bg-[#3b4660] transition-colors"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
            >
              <div className="size-[36px] rounded-full bg-white/20 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z" /></svg>
              </div>
              <svg viewBox="0 0 16 16" className={`size-[14px] text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="currentColor"><path d="M4 6l4 4 4-4z" /></svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[52px] bg-white rounded-[8px] py-[4px] overflow-hidden z-[80]" style={{ minWidth: 180, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.18)', border: '1px solid #f0f0f5' }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] group transition-colors"
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                >
                  <svg viewBox="0 0 24 24" className="size-[18px] text-[#1360d2] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="absolute top-full left-0 right-0 bg-[#0e1b3d] shadow-lg z-50 flex flex-col p-4 gap-3 lg:hidden">
          <button onClick={() => { goHome(); setMobileOpen(false); }} className="flex items-center gap-2 text-white text-[15px] hover:opacity-80 text-left">
            <img src={homeIconSrc} alt="Home" className="size-[20px]" />
            Home
          </button>
          <button className="text-white text-[15px] hover:opacity-80 text-left" onClick={() => { openServiceCatalogue(); setMobileOpen(false); }}>Service Catalogue</button>
          <button className="text-white text-[15px] hover:opacity-80 text-left flex items-center gap-1">
            Trade Service Providers
            <svg viewBox="0 0 16 16" className="size-[14px]" fill="currentColor"><path d="M4 6l4 4 4-4z" /></svg>
          </button>
          <button className="text-white text-[15px] hover:opacity-80 text-left">Take a Tour</button>
          <button className="text-white text-[15px] hover:opacity-80 text-left">Knowledge Hub</button>
        </nav>
      )}

      {/* Service Catalogue overlay — opened from any page's header. Portaled to
          <body> so it escapes the header's z-40 sticky stacking context. */}
      {catalogueOpen && createPortal(
        <ServiceCatalogueModal onClose={() => setCatalogueOpen(false)} />,
        document.body,
      )}
    </header>
  );
}
