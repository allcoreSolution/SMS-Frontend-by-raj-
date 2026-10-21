import React, { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "What license do I get?",
      a: "You receive a perpetual, commercial license allowing you to legally modify, rebrand, and resell this software as a SaaS product. You own the code for life."
    },
    {
      q: "Can I deploy this for multiple schools / clients?",
      a: "Yes. The Super Admin panel allows you to create and manage an unlimited number of schools/tenants on a single deployment."
    },
    {
      q: "Is this refundable?",
      a: "Because source code is a digital product that cannot be physically returned once downloaded, we generally do not offer refunds. Please test the live demo thoroughly before purchasing."
    },
    {
      q: "What does the 1-year support cover?",
      a: "The included 1 year of support covers technical assistance with bug fixes, security patches, and deployment help for your first setup via WhatsApp and Email.",
      highlight: true
    },
    {
      q: "What tech stack is this built on?",
      a: "The core API is built on Node.js/Express with MongoDB. The web dashboards use React 18, and all three mobile apps are built natively in Flutter."
    },
    {
      q: "Is the code obfuscated or encrypted in any way?",
      a: "No. You get 100% clean, raw, unencrypted source code without any ionCube, obfuscation, or phone-home tracking. It is completely yours to modify."
    },
    {
      q: "Can I resell the source code?",
      a: "No. You can resell access to the software as a SaaS, or deploy it for your direct clients. However, you are strictly prohibited from reselling or redistributing the raw source code itself."
    }
  ];

  const [openIdx, setOpenIdx] = useState(3); // Default open (support question)

  return (
    <section className="py-8 lg:py-10 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto bg-white">
      
      {/* Clean Header Box */}
      <div className="relative z-10 text-center mb-6 flex flex-col items-center max-w-3xl mx-auto py-2 sm:p-3">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[8px] sm:text-[9px] px-2.5 py-1 mb-2 rounded-full shadow-sm">
          GOT QUESTIONS?
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-[1.1] tracking-tighter">
          Before you buy
        </h2>
      </div>

      <div className="flex flex-col border-t border-gray-100">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-100">
            <button 
              className="w-full py-3 flex justify-between items-center text-left focus:outline-none group"
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            >
              <span className={`text-[12px] sm:text-[13px] font-bold pr-6 transition-colors ${faq.highlight || openIdx === i ? 'text-[#09B48E]' : 'text-gray-900 group-hover:text-[#09B48E]'}`}>
                {faq.q}
              </span>
              <span className={`w-5 h-5 rounded-full flex flex-shrink-0 items-center justify-center text-[10px] font-black transition-colors ${openIdx === i ? 'bg-[#09B48E] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-[#E8F8F5] group-hover:text-[#09B48E]'}`}>
                {openIdx === i ? '−' : '+'}
              </span>
            </button>
            
            {openIdx === i && (
              <div className="pb-3 pr-10 text-gray-500 font-[500] text-[11px] sm:text-[12px] leading-snug animate-[slideUp_0.2s_ease-out]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
