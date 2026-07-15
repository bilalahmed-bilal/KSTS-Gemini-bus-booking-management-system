"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ہزارہ موورز کا نیا ڈیٹا بیس مع نئے کرایے اور کلاس کے نام
const HAZARA_BUSES_DATABASE = [
  // 1. Standard Executive Class (صبح 8، دوپہر 12، شام 4، رات 8) - کرایہ: 6000
  { id: "HM-STD-08AM", serviceType: "Standard Executive Class (سٹینڈرڈ ایگزیکٹو)", time: "08:00 AM", fare: 6000, totalSeats: 40 },
  { id: "HM-STD-12PM", serviceType: "Standard Executive Class (سٹینڈرڈ ایگزیکٹو)", time: "12:00 PM", fare: 6000, totalSeats: 40 },
  { id: "HM-STD-04PM", serviceType: "Standard Executive Class (سٹینڈرڈ ایگزیکٹو)", time: "04:00 PM", fare: 6000, totalSeats: 40 },
  { id: "HM-STD-08PM", serviceType: "Standard Executive Class (سٹینڈرڈ ایگزیکٹو)", time: "08:00 PM", fare: 6000, totalSeats: 40 },

  // 2. Business Class (دوپہر 12، شام 4) - کرایہ: 8000
  { id: "HM-BUS-12PM", serviceType: "Business Class (بزنس)", time: "12:00 PM", fare: 8000, totalSeats: 30 },
  { id: "HM-BUS-04PM", serviceType: "Business Class (بزنس)", time: "04:00 PM", fare: 8000, totalSeats: 30 },

  // 3. Sleeper Class (شام 4، شام 6) - کرایہ: 11500
  { id: "HM-SLP-04PM", serviceType: "Sleeper Class (سلیپر)", time: "04:00 PM", fare: 11500, totalSeats: 24 },
  { id: "HM-SLP-06PM", serviceType: "Sleeper Class (سلیپر)", time: "06:00 PM", fare: 11500, totalSeats: 24 }
];

export default function BusesPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<any>(null);
  const [activeOffice, setActiveOffice] = useState<any>(null);

  useEffect(() => {
    const savedOffice = localStorage.getItem("activeOffice");
    const savedSearch = localStorage.getItem("searchDetails");
    
    if (savedOffice) setActiveOffice(JSON.parse(savedOffice));
    if (savedSearch) setSearchParams(JSON.parse(savedSearch));
  }, []);

  if (!searchParams || !activeOffice) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">معلومات لوڈ ہو رہی ہیں...</p>
      </div>
    );
  }

  const handleSelectBus = (bus: any) => {
    localStorage.setItem("selectedBus", JSON.stringify({
      ...bus,
      operator: "ہزارہ موورز (Hazara Movers)",
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date
    }));
    router.push("/booking");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* سمارٹ روٹ ہیڈر */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">فعال برانچ: {activeOffice.name}</p>
            <h2 className="text-2xl font-black mt-1">
              {searchParams.from} ➔ {searchParams.to}
            </h2>
            <p className="text-sm text-blue-100 mt-1">سفر کی تاریخ: {searchParams.date}</p>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/10 transition"
          >
            روٹ تبدیل کریں
          </button>
        </div>
      </div>

      <h3 className="text-lg font-black text-slate-900 border-b pb-2 flex items-center gap-2">
        <span>🚍</span> دستیاب گاڑیاں (Hazara Movers Active Fleet)
      </h3>

      {/* بسوں کی لسٹ */}
      <div className="space-y-4">
        {HAZARA_BUSES_DATABASE.map((bus) => (
          <div 
            key={bus.id} 
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center gap-4"
          >
            {/* بائیں طرف: لوگو اور بس کی تفصیل */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <img src="/Hazara-bus-png.png" alt="Hazara Bus" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Hazara Fleet
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">{bus.serviceType}</h4>
                <p className="text-xs text-slate-400 mt-0.5">سپر لگژری ایئر کنڈیشنڈ سروس</p>
              </div>
            </div>

            {/* درمیان میں: روانگی کا وقت */}
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-400 font-bold uppercase">روانگی کا وقت</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{bus.time}</p>
              <span className="text-[10px] text-emerald-600 font-bold">🟢 آن ٹائم (On Time)</span>
            </div>

            {/* دائیں طرف: کرایہ اور سیٹ سلیکشن کا بٹن */}
            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <p className="text-xs text-slate-400 font-bold">ٹکٹ کا کرایہ</p>
              <p className="text-2xl font-black text-blue-700">Rs. {bus.fare.toLocaleString()}</p>
              <button 
                onClick={() => handleSelectBus(bus)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                سيٹیں منتخب کریں ➔
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
