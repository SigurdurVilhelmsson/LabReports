import React from 'react';
import { Info, UserCircle } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
  onInfoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick, onInfoClick }) => {
  // Home path always goes to root landing page
  const homePath = '/';

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href={homePath}
            className="text-xl font-bold text-slate-900 hover:text-kvenno-orange transition"
          >
            Kvenno Efnafræði
          </a>

          <div className="flex items-center gap-3">
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-kvenno-orange transition border border-slate-300 rounded-lg hover:border-kvenno-orange"
              >
                <UserCircle size={20} />
                <span className="font-medium">Admin</span>
              </button>
            )}
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-kvenno-orange transition border border-slate-300 rounded-lg hover:border-kvenno-orange"
              >
                <Info size={20} />
                <span className="font-medium">Info</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
