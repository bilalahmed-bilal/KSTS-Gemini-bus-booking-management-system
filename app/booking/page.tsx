"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const [bus, setBus] = useState<any>(null);
  const [activeOffice, setActiveOffice] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerCNIC, setPassengerCNIC] = useState("");
  const [passengerGender, setPassengerGender] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  useEffect(() => {
    const savedBus = localStorage.getItem("selectedBus");
    const savedOffice = localStorage.getItem("activeOffice");
    
    if (savedBus) setBus(JSON.parse(savedBus));
    if (savedOffice) setActiveOffice(JSON.parse(savedOffice));
  }, []);

  if (!bus || !activeOffice) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">معلومات لوڈ ہو رہی ہیں...</p>
      </div>
    );
  }

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("براہ کرم بکنگ کے لیے کم از کم ایک سیٹ منتخب کریں!");
      return;
    }
    if (!passengerGender) {
      alert("براہ کرم مسافر کا جنڈر (مرد یا خاتون) منتخب کریں تاکہ سیٹ ریزرویشن واضح ہو سکے!");
      return;
    }

    const ticketId = `HM-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = selectedSeats.length * bus.fare;

    const newBooking = {
      ticketId,
      branchId: activeOffice.id,
      branchName: activeOffice.name,
      from: bus.from,
      to: bus.to,
      date: bus.date,
      busType: bus.serviceType,
      time: bus.time,
      seats: selectedSeats,
      amount: totalAmount,
      passengerName,
      passengerPhone,
      passengerCNIC,
      passengerGender,
      bookedAt: new Date().toLocaleString()
    };

    const existingHistory = JSON.parse(localStorage.getItem("allBookingsHistory") || "[]");
    localStorage.setItem("allBookingsHistory", JSON.stringify([newBooking, ...existingHistory]));

    setGeneratedTicket(newBooking);
    setBookingSuccess(true);
  };

  if (bookingSuccess && generatedTicket) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border border-slate-200">
        <div className="text-center border-b pb-4 mb-6">
          <span className="text-5xl">🎉</span>
          <h2 className="text-2xl font-black text-emerald-600 mt-2">ٹکٹ کامیابی سے بک ہو گیا!</h2>
          <p className="text-xs text-slate-400 mt-1">ہزارہ موورز رئیل ٹائم بکنگ سسٹم</p>
        </div>

        <div className="space-y-4 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100 text-right" style={{ direction: "rtl" }}>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">ٹکٹ آئی ڈی:</span> <span className="font-extrabold text-blue-700 font-mono">{generatedTicket.ticketId}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">مسافر کا نام:</span> <span className="font-bold text-slate-900">{generatedTicket.passengerName}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">جنڈر (Gender):</span> <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">{generatedTicket.passengerGender === "Male" ? "👨 مرد (Male)" : "👩 خاتون (Female)"}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">فون نمبر:</span> <span className="font-semibold text-slate-700">{generatedTicket.passengerPhone}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">روٹ:</span> <span className="font-bold text-slate-900">{generatedTicket.from} سے {generatedTicket.to}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">گاڑی اور وقت:</span> <span className="font-bold text-slate-800">{generatedTicket.busType} ({generatedTicket.time})</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-400">نشست نمبر:</span> <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">{generatedTicket.seats.join(", ")}</span></div>
          <div className="flex justify-between pt-2 text-base font-black"><span className="text-slate-900">کل رقم:</span> <span className="text-emerald-600">Rs. {generatedTicket.amount.toLocaleString()}</span></div>
        </div>

        <div className="mt-8 space-y-3">
          <button onClick={() => window.print()} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow">
            🖨️ ٹکٹ پرنٹ کریں (Print)
          </button>
          <button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow">
            مین ڈیسک پر واپس جائیں ➔
          </button>
        </div>
      </div>
    );
  }

  const renderSeatingLayout = () => {
    const isSleeper = bus.serviceType.includes("Sleeper");
    const isBusiness = bus.serviceType.includes("Business");

    // SLEEPER CLASS LAYOUT WITH CLEAR LOWER & UPPER MARKS
    if (isSleeper) {
      const rows = [1, 2, 3, 4, 5]; // 5 rows
      return (
        <div className="w-full max-w-md bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-4">
          {rows.map((rowNo) => {
            const baseIndex = (rowNo - 1) * 6;

            const leftLowerNum = baseIndex + 1;
            const leftUpperNum = baseIndex + 2;
            const right1LowerNum = baseIndex + 3;
            const right1UpperNum = baseIndex + 4;
            const right2LowerNum = baseIndex + 5;
            const right2UpperNum = baseIndex + 6;

            const leftLower = `L-${leftLowerNum}`;
            const leftUpper = `U-${leftUpperNum}`;
            const right1Lower = `L-${right1LowerNum}`;
            const right1Upper = `U-${right1UpperNum}`;
            const right2Lower = `L-${right2LowerNum}`;
            const right2Upper = `U-${right2UpperNum}`;

            return (
              <div key={rowNo} className="grid grid-cols-7 gap-2 items-center border-b border-slate-200/60 pb-3 last:border-0">
                {/* بائیں طرف سنگل برتھ */}
                <div className="col-span-2 flex flex-col gap-1.5">
                  {/* Lower Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(leftLower)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(leftLower) ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
                  >
                    <span className="text-[11px]">🛌 {leftLower}</span>
                    <span className="text-[7.5px] uppercase text-slate-400 font-bold leading-none mt-0.5">Lower (نیچے)</span>
                  </button>
                  {/* Upper Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(leftUpper)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(leftUpper) ? "bg-indigo-600 text-white border-indigo-700" : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"}`}
                  >
                    <span className="text-[11px]">🛌 {leftUpper}</span>
                    <span className="text-[7.5px] uppercase text-slate-505 font-bold leading-none mt-0.5">Upper (اوپر)</span>
                  </button>
                </div>

                {/* راہ */}
                <div className="col-span-1 text-center text-[10px] text-slate-400 font-black">راہ</div>

                {/* دائیں طرف ڈبل برتھ کا پہلا حصہ */}
                <div className="col-span-2 flex flex-col gap-1.5">
                  {/* Lower Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(right1Lower)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(right1Lower) ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
                  >
                    <span className="text-[11px]">🛌 {right1Lower}</span>
                    <span className="text-[7.5px] uppercase text-slate-400 font-bold leading-none mt-0.5">Lower (نیچے)</span>
                  </button>
                  {/* Upper Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(right1Upper)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(right1Upper) ? "bg-indigo-600 text-white border-indigo-700" : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"}`}
                  >
                    <span className="text-[11px]">🛌 {right1Upper}</span>
                    <span className="text-[7.5px] uppercase text-slate-505 font-bold leading-none mt-0.5">Upper (اوپر)</span>
                  </button>
                </div>

                {/* دائیں طرف ڈبل برتھ کا دوسرا حصہ */}
                <div className="col-span-2 flex flex-col gap-1.5">
                  {/* Lower Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(right2Lower)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(right2Lower) ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
                  >
                    <span className="text-[11px]">🛌 {right2Lower}</span>
                    <span className="text-[7.5px] uppercase text-slate-400 font-bold leading-none mt-0.5">Lower (نیچے)</span>
                  </button>
                  {/* Upper Bed */}
                  <button 
                    type="button" 
                    onClick={() => handleSeatClick(right2Upper)} 
                    className={`py-2 rounded-lg text-[9px] font-extrabold border transition flex flex-col items-center justify-center ${selectedSeats.includes(right2Upper) ? "bg-indigo-600 text-white border-indigo-700" : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"}`}
                  >
                    <span className="text-[11px]">🛌 {right2Upper}</span>
                    <span className="text-[7.5px] uppercase text-slate-505 font-bold leading-none mt-0.5">Upper (اوپر)</span>
                  </button>
                </div>
              </div>
            );
          })}
          {/* آخری برتھ (31st Single Back Lower Berth) */}
          <div className="pt-2 border-t flex justify-center">
            <button 
              type="button" 
              onClick={() => handleSeatClick("L-31")} 
              className={`py-2 px-6 rounded-xl text-xs font-black border transition flex flex-col items-center justify-center ${selectedSeats.includes("L-31") ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
            >
              <span>🛌 L-31 (Back Seat)</span>
              <span className="text-[8px] uppercase text-slate-400 font-bold leading-none mt-0.5">Lower Level (نیچے)</span>
            </button>
          </div>
        </div>
      );
    }

    // 2. BUSINESS CLASS (35 SEATS)
    if (isBusiness) {
      const rows = Array.from({ length: 11 }, (_, i) => i + 1);
      return (
        <div className="w-full max-w-sm bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-3">
          {rows.map((rowNo) => {
            const leftSeat = `${(rowNo - 1) * 3 + 1}`;
            const rightSeat1 = `${(rowNo - 1) * 3 + 2}`;
            const rightSeat2 = `${(rowNo - 1) * 3 + 3}`;

            return (
              <div key={rowNo} className="grid grid-cols-4 gap-3 items-center">
                <button type="button" onClick={() => handleSeatClick(leftSeat)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(leftSeat) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {leftSeat}</button>
                <div className="col-span-1 text-center text-[10px] text-slate-300">راہ</div>
                <button type="button" onClick={() => handleSeatClick(rightSeat1)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(rightSeat1) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {rightSeat1}</button>
                <button type="button" onClick={() => handleSeatClick(rightSeat2)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(rightSeat2) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {rightSeat2}</button>
              </div>
            );
          })}
          <div className="grid grid-cols-4 gap-3 pt-2 border-t">
            <button type="button" onClick={() => handleSeatClick("34")} className={`h-10 col-span-2 rounded-xl font-bold text-xs border transition ${selectedSeats.includes("34") ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 34</button>
            <button type="button" onClick={() => handleSeatClick("35")} className={`h-10 col-span-2 rounded-xl font-bold text-xs border transition ${selectedSeats.includes("35") ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 35</button>
          </div>
        </div>
      );
    }

    // 3. STANDARD EXECUTIVE (41 SEATS)
    const rows = Array.from({ length: 10 }, (_, i) => i + 1);
    return (
      <div className="w-full max-w-sm bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-3">
        {rows.map((rowNo) => {
          const leftSeat1 = `${(rowNo - 1) * 4 + 1}`;
          const leftSeat2 = `${(rowNo - 1) * 4 + 2}`;
          const rightSeat1 = `${(rowNo - 1) * 4 + 3}`;
          const rightSeat2 = `${(rowNo - 1) * 4 + 4}`;

          return (
            <div key={rowNo} className="grid grid-cols-5 gap-2 items-center">
              <button type="button" onClick={() => handleSeatClick(leftSeat1)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(leftSeat1) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {leftSeat1}</button>
              <button type="button" onClick={() => handleSeatClick(leftSeat2)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(leftSeat2) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {leftSeat2}</button>
              <div className="col-span-1 text-center text-[10px] text-slate-300">راہ</div>
              <button type="button" onClick={() => handleSeatClick(rightSeat1)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(rightSeat1) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {rightSeat1}</button>
              <button type="button" onClick={() => handleSeatClick(rightSeat2)} className={`h-10 rounded-xl font-bold text-xs border transition ${selectedSeats.includes(rightSeat2) ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 {rightSeat2}</button>
            </div>
          );
        })}
        <div className="pt-2 border-t flex justify-center">
          <button type="button" onClick={() => handleSeatClick("41")} className={`h-10 w-full max-w-[120px] rounded-xl font-bold text-xs border transition ${selectedSeats.includes("41") ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>💺 41 (Back Seat)</button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* بائیں کالم (سیٹ میپ) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
        <h3 className="text-lg font-black text-slate-900 border-b pb-3 w-full mb-6 flex justify-between items-center">
          <span>🚍 گاڑی کی نشستوں کا نقشہ ({bus.serviceType})</span>
          <span className="text-xs text-slate-400">کل سیٹیں: {bus.serviceType.includes("Sleeper") ? "31 بیڈز" : bus.serviceType.includes("Business") ? "35 سیٹیں" : "41 سیٹیں"}</span>
        </h3>

        <div className="w-full max-w-sm flex justify-between items-center mb-6 px-4 bg-slate-50 py-2.5 rounded-xl border border-slate-100">
          <span className="text-sm font-extrabold text-slate-400">🚪 داخلی دروازہ (Gate)</span>
          <span className="text-2xl animate-spin" style={{ animationDuration: "12s" }}>⚙️ Steering</span>
        </div>

        {/* ڈائنامک گرڈ */}
        {renderSeatingLayout()}

        <div className="flex gap-4 mt-8 text-xs font-semibold text-slate-500 bg-slate-50 px-6 py-3 rounded-full flex-wrap justify-center">
          <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-white border border-slate-200 inline-block"></span> خالی نشست</div>
          <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-blue-600 inline-block"></span> منتخب لوئر برتھ (L - Lower)</div>
          <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-indigo-600 inline-block"></span> منتخب اپر برتھ (U - Upper)</div>
        </div>
      </div>

      {/* دائیں کالم */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-6 rounded-3xl shadow-lg border border-blue-900">
          <span className="text-[10px] bg-white/25 text-white px-2.5 py-1 rounded font-bold uppercase tracking-wider">منتخب گاڑی کی تفصیل</span>
          <h3 className="text-xl font-black mt-2">{bus.serviceType}</h3>
          <p className="text-sm text-blue-100 mt-1">{bus.from} ➔ {bus.to}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-600 text-xs">
            <div>
              <p className="text-blue-200 font-bold">روانگی کا وقت</p>
              <p className="text-base font-black mt-0.5">{bus.time}</p>
            </div>
            <div>
              <p className="text-blue-200 font-bold">کرایہ فی سیٹ</p>
              <p className="text-base font-black mt-0.5">Rs. {bus.fare.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-right" style={{ direction: "rtl" }}>
          <h3 className="text-lg font-black text-slate-900 border-b pb-3 mb-4 text-left">📝 مسافر کی معلومات (Passenger Details)</h3>
          
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">مسافر کا نام (Full Name)</label>
              <input 
                type="text" 
                required 
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="مثلاً محمد علی ہزارہ"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-right"
              />
            </div>

            {/* جینڈر کا سلیکشن لازمی رکھا گیا ہے */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">جنڈر کا انتخاب (Gender Selection)*</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPassengerGender("Male")}
                  className={`py-3 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${passengerGender === "Male" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  👨 مرد (Male)
                </button>
                <button
                  type="button"
                  onClick={() => setPassengerGender("Female")}
                  className={`py-3 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${passengerGender === "Female" ? "bg-pink-600 text-white border-pink-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  👩 خاتون (Female)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">موبائل نمبر (Mobile / WhatsApp)</label>
              <input 
                type="tel" 
                required 
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                placeholder="مثلاً 03001234567"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">شناختی کارڈ نمبر (Optional CNIC)</label>
              <input 
                type="text" 
                value={passengerCNIC}
                onChange={(e) => setPassengerCNIC(e.target.value)}
                placeholder="مثلاً 37405-1234567-8"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-right"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-2.5">
              <div className="flex justify-between flex-row-reverse"><span className="text-slate-400">منتخب سیٹیں/بیڈز:</span> <span className="font-extrabold text-blue-700">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "کوئی نہیں"}</span></div>
              <div className="flex justify-between flex-row-reverse"><span className="text-slate-400">ٹکٹوں کی تعداد:</span> <span className="font-bold text-slate-800">{selectedSeats.length} Seats</span></div>
              <div className="flex justify-between flex-row-reverse border-t pt-2 text-base font-black"><span className="text-slate-900">کل کرایہ:</span> <span className="text-blue-700">Rs. {(selectedSeats.length * bus.fare).toLocaleString()}</span></div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm mt-4"
            >
              🚀 بکنگ کنفرم کریں (Confirm Reservation)
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
