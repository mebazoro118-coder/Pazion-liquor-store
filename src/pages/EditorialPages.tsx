import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Award, Wine, Send, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-16">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-2">
          Heritage & Mission
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif text-stone-950 leading-tight">
          The Art of Intentional Cellar Curation
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
          Founded in 1994, Pazion Liquor Store stands as an international sanctuary for connoisseurs, collectors, and seekers of rare distillates and extraordinary terroirs.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative aspect-21/9 w-full bg-stone-900 overflow-hidden mb-16">
        <img
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2000&q=80"
          alt="Cellar Barrels"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center p-6 text-center">
          <p className="text-white font-serif text-xl sm:text-3xl max-w-2xl italic">
            "We do not merely stock shelves. We preserve heritage, certify provenance, and deliver excellence."
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="border border-stone-200 p-8 space-y-3 bg-stone-50">
          <ShieldCheck className="w-6 h-6 text-stone-900 stroke-[1.5]" />
          <h3 className="font-serif text-lg text-stone-950 font-semibold">
            Certified Provenance
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Every allocated vintage and rare single cask is directly acquired from certified estate domaines or bonded distilleries with chain-of-custody documentation.
          </p>
        </div>

        <div className="border border-stone-200 p-8 space-y-3 bg-stone-50">
          <Clock className="w-6 h-6 text-stone-900 stroke-[1.5]" />
          <h3 className="font-serif text-lg text-stone-950 font-semibold">
            Climate Preservation
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Our vaults operate strictly at 55°F (13°C) and 70% relative humidity, ensuring every cork, label, and distillate maintains peak aromatic integrity.
          </p>
        </div>

        <div className="border border-stone-200 p-8 space-y-3 bg-stone-50">
          <Award className="w-6 h-6 text-stone-900 stroke-[1.5]" />
          <h3 className="font-serif text-lg text-stone-950 font-semibold">
            Concierge Advisory
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Whether securing an allocation for private collectors or organizing bespoke corporate gifts, our master sommeliers provide personalized cellar consultations.
          </p>
        </div>
      </div>

      {/* Sommelier Quote */}
      <div className="border-y border-stone-200 py-12 text-center max-w-2xl mx-auto">
        <Wine className="w-8 h-8 mx-auto text-amber-700 mb-3" />
        <p className="font-serif text-lg sm:text-xl text-stone-900 italic">
          "A great spirit is liquid time. Our purpose is to connect you with moments crafted decades ago by master distillers across the globe."
        </p>
        <span className="block text-xs uppercase tracking-widest text-stone-600 mt-4 font-semibold">
          — Julien Pazion, Founder & Cellarmaster
        </span>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Private Cellar Sourcing');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 border-b border-stone-200 pb-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
          Concierge Services
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-950">
          Contact Pazion Cellars
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
          For allocation requests, private sommelier inquiries, corporate gifting, or boutique pickup coordination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact info & Locations */}
        <div className="space-y-8">
          <div className="border border-stone-200 p-6 space-y-4 bg-stone-50">
            <h3 className="font-serif text-base text-stone-900 font-semibold">
              Flagship Boutique & Cellar
            </h3>
            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Pazion Flagship Store</p>
                  <p>482 West Broadway, SoHo</p>
                  <p>New York, NY 10012</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-900 shrink-0" />
                <p>+1 (212) 555-0194</p>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-900 shrink-0" />
                <p>concierge@pazionliquor.com</p>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-200">
                <Clock className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Boutique & Delivery Hours</p>
                  <p>Monday – Saturday: 10:00 AM – 10:00 PM</p>
                  <p>Sunday: 12:00 PM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Special Order Consignments</p>
            <p>
              Looking for an allocated vintage not listed in our public vault? Our acquisitions desk can source directly from European auctions and bonded warehouses.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-8">
          {sent ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">Message Dispatched</h3>
              <p className="text-stone-600 text-xs max-w-sm mx-auto">
                A dedicated cellar concierge has received your inquiry and will respond within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patron@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Inquiry Nature
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none"
                >
                  <option value="Private Cellar Sourcing">Private Cellar Sourcing & Rare Vintages</option>
                  <option value="Corporate Gifting">Corporate Gifting & Wooden Box Cases</option>
                  <option value="Delivery Coordination">Same-Day White Glove Delivery Coordination</option>
                  <option value="Event Sommelier">Sommelier Tasting & Event Inquiries</option>
                  <option value="General Question">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your cellar inquiry, allocation request, or event specifications..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
