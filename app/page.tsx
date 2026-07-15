"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Bus Schedule Data in English
const BUS_SCHEDULE = [
  { id: "1", from: "Karachi", to: "Islamabad", time: "06:00 PM", fare: 7500, serviceType: "Sleeper Class" },
  { id: "2", from: "Karachi", to: "Haripur", time: "07:00 PM", fare: 8000, serviceType: "Business Class" },
  { id: "3", from: "Karachi", to: "Abbottabad", time: "08:00 PM", fare: 8200, serviceType: "Standard Executive" },
  { id: "4", from: "Karachi", to: "Mansehra", time: "09:00 PM", fare: 8500, serviceType: "Sleeper Class" },
];

export default function SearchPage() {
  const router = useRouter();
  // 'from' is fixed to Karachi
  const [from] = useState("Karachi"); 
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !date) {
      alert("Please select destination and travel date!");
      return;
    }

    const filtered = BUS_SCHEDULE.filter(
      (bus) => bus.from === from && bus.to === to
    );

    setSearchResults(filtered);
    setIsSearched(true);
  };

  const selectBus = (bus: any) => {
    const selectedBusData = { ...bus, date };
    localStorage.setItem("selectedBus", JSON.stringify(selectedBusData));
    router.push("/booking");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" style={{ direction: "ltr" }}>
      <h1 className="text-3xl font-black text-center text-blue-900 mb-8">KSTS Bus Booking System</h1>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* From - Locked as Karachi */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">From:</label>
            <div className="w-full px-4 py-3 border rounded-xl bg-gray-100 font-bold text-gray-800">Karachi</div>
          </div>

          {/* To - 4 Cities Option */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">To:</label>
            <select
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select City</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Haripur">Haripur</option>
              <option value="Abbottabad">Abbottabad</option>
              <option value="Mansehra">Mansehra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Date:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition">Search Buses 🔍</button>
        </form>
      </div>

      {/* Results */}
      {isSearched && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((bus) => (
              <div key={bus.id} className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-lg text-blue-900">{bus.serviceType}</h3>
                  <p className="text-gray-600">Karachi to {bus.to} | Time: {bus.time}</p>
                  <p className="text-emerald-600 font-black">PKR {bus.fare}</p>
                </div>
                <button onClick={() => selectBus(bus)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition">Select Seats</button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 font-bold">No buses available for this route.</p>
          )}
        </div>
      )}
    </div>
  );
}