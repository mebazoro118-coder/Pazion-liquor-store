import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, Wine, CreditCard } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Legal Age & Handover Verification',
      items: [
        {
          q: 'What are the legal age requirements for ordering from Pazion?',
          a: 'All customers must be of legal drinking age in their delivery jurisdiction (21+ in the United States, 18+ or 19+ in international territories). Age verification is performed digitally during checkout and affirmed physically by our couriers before packages are released.',
        },
        {
          q: 'What forms of ID are accepted upon courier delivery?',
          a: 'Couriers require a valid, non-expired, government-issued photo ID (Driver’s License, Passport, or State Identification Card). We cannot leave alcohol consignments unattended at doorways or with minors under any circumstances.',
        },
      ],
    },
    {
      category: 'Insulated Climate Delivery & Pickup',
      items: [
        {
          q: 'How are sensitive vintages and aged spirits protected during transit?',
          a: 'All consignments are packed in impact-resistant, temperature-stabilized corrugated cells with thermal linings when transit temperatures require climate protection.',
        },
        {
          q: 'Do you offer same-day express delivery?',
          a: 'Yes. For qualifying metropolitan zip codes, orders placed before 4:00 PM are dispatched via dedicated white-glove couriers within 2–4 hours.',
        },
        {
          q: 'How does boutique store pickup work?',
          a: 'Store pickup at our SoHo flagship (482 West Broadway) is complimentary. Orders are generally prepared and held in our cellar vault within 1 hour.',
        },
      ],
    },
    {
      category: 'Authentication & Provenance',
      items: [
        {
          q: 'How does Pazion guarantee bottle authenticity?',
          a: 'We source directly from estate cellars, licensed bonded warehouses, and official distiller importers. We never purchase from untraceable secondary private markets without full forensic cellar documentation.',
        },
        {
          q: 'Can I request high-resolution provenance photography before buying an allocated bottle?',
          a: 'Yes. For rare bottles exceeding $500, contact our concierge desk to receive 360-degree high-resolution photography of the capsule, ullage level, and tax stamp.',
        },
      ],
    },
  ];

  let flatIndex = 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold mb-1">
          Cellar Assistance
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-950">
          Frequently Asked Questions
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Clear answers regarding legal age compliance, temperature-controlled delivery, and rare allocations.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 border-b border-stone-200 pb-2">
              {cat.category}
            </h2>

            <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
              {cat.items.map((item) => {
                const currentFlat = flatIndex++;
                const isOpen = openIdx === currentFlat;
                return (
                  <div key={currentFlat} className="p-4 sm:p-5">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : currentFlat)}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-serif text-sm sm:text-base text-stone-900 font-medium">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 transition-transform ${
                          isOpen ? 'rotate-180 text-stone-900' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
