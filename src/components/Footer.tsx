import React, { useState } from 'react';
import { Wine, ShieldCheck, Truck, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Newsletter Bar */}
      <div className="border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium mb-1">
              Private Cellar Dispatch
            </p>
            <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
              Receive Allocation & Rare Release Alerts
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Subscribers receive first access to limited vintages, masterclass invitations, and seasonal cellar selections.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-3 bg-stone-900 border border-stone-700 text-stone-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you. You are now enrolled in the Pazion private dispatch.</span>
              </div>
            ) : (
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-stone-100 text-xs px-4 py-3 placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-[10px] text-stone-500 mt-2">
              By subscribing, you confirm you are of legal drinking age in your country of residence.
            </p>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-[0.2em] text-white uppercase">
                PAZION
              </span>
              <span className="text-[10px] uppercase tracking-[0.38em] text-stone-400 -mt-0.5">
                LIQUOR STORE
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Purveyors of exceptional spirits, fine wines, and artisanal libations. Selected with rigorous curation for distinguished palates, celebrations, and thoughtful gifting worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a href="#" className="p-2 bg-stone-900 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-stone-900 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-stone-900 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium mb-4">
              The Collection
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop', 'Whisky')} className="hover:text-white transition-colors">
                  Single Malt Whiskies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Champagne')} className="hover:text-white transition-colors">
                  Prestige Champagnes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Wine')} className="hover:text-white transition-colors">
                  Grand Cru & Fine Wines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Tequila')} className="hover:text-white transition-colors">
                  Añejo & Artisanal Tequilas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Gin')} className="hover:text-white transition-colors">
                  Botanical Spirits & Gins
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Non-alcoholic')} className="hover:text-white transition-colors">
                  Zero-Proof & Botanical
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition-colors">
                  Track Your Consignment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Brand Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Store Concierge & Tasting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  Delivery & FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                  Private Cellar Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-stone-400 hover:text-stone-200 transition-colors">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium mb-4">
              Store & Flagship
            </h4>
            <div className="text-xs text-stone-400 space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>742 Grand Avenue, Boutique No. 12<br />Metropolitan District, NY 10012</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>+1 (800) 492-PAZION</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>concierge@pazionliquor.com</span>
              </p>
            </div>
            <div className="pt-2 text-[11px] text-stone-400 leading-relaxed border-t border-stone-800">
              Boutique Hours: Mon-Sat 10:00 - 22:00<br />
              Sunday Reserve: 12:00 - 20:00
            </div>
          </div>
        </div>

        {/* Responsible drinking badge */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Pazion champions mindful, responsible enjoyment. Please do not drink and drive.</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Strict age verification is conducted upon digital checkout and physical courier delivery.
          </div>
        </div>

        {/* Legal Row */}
        <div className="mt-8 pt-4 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Pazion Liquor Store LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-400">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400">Terms of Service</a>
            <a href="#" className="hover:text-stone-400">Delivery Guidelines</a>
            <a href="#" className="hover:text-stone-400">Alcohol Licensing Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
