import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      stars: 5,
      text: "We onboarded 12 branch campuses onto MultiSchool ERP. The multi-school management is seamless — our management trust monitors fees, staff attendance, and academic performance across all branches in real-time.",
      author: "Rajesh Kumar",
      role: "Managing Director, Progressive Public School Chain",
      initials: "RK",
      bgClass: "bg-teal-50"
    },
    {
      stars: 5,
      text: "The biometric sync and live bus GPS gave our parents immense peace of mind. Daily attendance notification reaches parents instantly via the mobile app, reducing office calls by 80%.",
      author: "Sunita Patel",
      role: "School Administrator & Principal",
      initials: "SP",
      bgClass: "bg-lime-50"
    },
    {
      stars: 5,
      text: "The AI exam question generator and fee collection desk transformed our operations. Fee recovery improved significantly in the first term because parents can pay securely via UPI right inside the app.",
      author: "Amit Mishra",
      role: "Founder & Chairman, LearnFirst Academy",
      initials: "AM",
      bgClass: "bg-amber-50"
    }
  ];

  return (
    <section className="pt-20 lg:pt-28 pb-0 flex flex-col items-center border-t-[3px] border-gray-900 bg-white/50 bg-grid-pattern overflow-hidden relative">
      
      {/* Clean Header Box */}
      <div className="relative z-10 text-center mb-12 flex flex-col items-center max-w-3xl mx-auto py-4 sm:p-5">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[8px] sm:text-[9px] px-2.5 py-1 mb-3 rounded-full shadow-sm">
          TRUSTED BY PRINCIPALS & TRUSTEES
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter">
          What educators &amp; school leaders say after <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-700">joining.</span>
        </h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-12 max-w-[1400px] w-full mb-20">
        {reviews.map((rev, i) => (
          <div key={i} className="relative group w-full h-full">
            <div className={`relative bg-white border border-gray-100 p-6 sm:p-8 flex flex-col h-full rounded-2xl shadow-sm hover:shadow-md transition-shadow group-hover:-translate-y-1 ${rev.bgClass}`}>
               <div className="flex gap-1 mb-5 bg-white border border-gray-100 w-max px-2.5 py-1 rounded-sm shadow-sm">
                  {[...Array(rev.stars)].map((_, s) => (
                    <span key={s} className="text-amber-500 text-[15px] drop-shadow-sm">★</span>
                  ))}
               </div>
               
               <p className="text-gray-900 font-bold italic text-[14px] sm:text-[15px] leading-relaxed mb-8 flex-1">
                  "{rev.text}"
               </p>
               
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center font-black rounded-full border border-emerald-100">
                    {rev.initials}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-[13px] uppercase tracking-wide">{rev.author}</div>
                    <div className="text-gray-500 font-semibold text-[10px] sm:text-[11px] leading-tight mt-0.5">{rev.role}</div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges Footer Bar (Soft) */}
      <div className="relative z-10 w-full bg-[#E8F8F5] border-t border-b border-gray-200 py-6 sm:py-8 px-4 flex justify-center">
         <div className="max-w-[1400px] w-full flex flex-wrap justify-center items-center gap-x-8 lg:gap-x-12 gap-y-6">
            
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="bg-white border border-gray-200 shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[15px] group-hover:-translate-y-1 transition-transform">🔒</div>
               <span className="text-[#09B48E] font-black uppercase text-[9px] sm:text-[11px] tracking-widest mt-1">100% Data Isolation <br className="hidden sm:block" /> Secure Cloud Backup</span>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="bg-white border border-gray-200 shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[15px] group-hover:-translate-y-1 transition-transform">⚡</div>
               <span className="text-[#09B48E] font-black uppercase text-[9px] sm:text-[11px] tracking-widest mt-1">Instant Onboarding <br className="hidden sm:block" /> Go Live in 24 Hours</span>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="bg-white border border-gray-200 shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[15px] group-hover:-translate-y-1 transition-transform">🏷️</div>
               <span className="text-[#09B48E] font-black uppercase text-[9px] sm:text-[11px] tracking-widest mt-1">White-label <br className="hidden sm:block" /> your brand</span>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="bg-white border border-gray-200 shadow-sm rounded-full w-9 h-9 flex items-center justify-center text-[15px] group-hover:-translate-y-1 transition-transform">📦</div>
               <span className="text-[#09B48E] font-black uppercase text-[9px] sm:text-[11px] tracking-widest mt-1">Instant Automated <br className="hidden sm:block" /> delivery</span>
            </div>

         </div>
      </div>
    </section>
  );
}
