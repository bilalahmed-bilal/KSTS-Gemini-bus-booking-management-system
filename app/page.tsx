"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Bus Schedule Data in English
const BUS_SCHEDULE = [
  { id: "1", from: "Mansehra", to: "Karachi", time: "02:00 PM", fare: 7500, serviceType: "Sleeper Class" },
  { id: "2", from: "Mansehra", to: "Karachi", time: "06:00 PM", fare: 6500, serviceType: "Business Class" },
  { id: "3", from: "Karachi", to: "Mansehra", time: "11:00 AM", fare: 5500, serviceType: "Standard Executive" },
  { id: "4", from: "Abbottabad", to: "Karachi", time: "04:00 PM", fare: 7200, serviceType: "Sleeper Class" },
  { id: "5", from: "Karachi", to: "Abbottabad", time: "08:00 PM", fare: 6200, serviceType: "Business Class" }
];

export default function SearchPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);

  // Load bookings to calculate available/booked seats
  const loadBookings = () => {
    if (typeof window !== "undefined") {
      const history = JSON.parse(localStorage.getItem("allBookingsHistory") || "[]");
      setBookingHistory(history);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please select departure city, destination, and travel date!");
      return;
    }

    // Refresh history on search
    loadBookings();

    // Match route
    const filtered = BUS_SCHEDULE.filter(
      (bus) => bus.from.toLowerCase() === from.toLowerCase() && bus.to.toLowerCase() === to.toLowerCase()
    );

    setSearchResults(filtered);
    setIsSearched(true);
  };

  // Real-time seat calculation logic
  const getSeatStats = (bus: any) => {
    // 1. Assign total seats based on type
    let totalSeats = 41; // Default Executive
    if (bus.serviceType.toLowerCase().includes("sleeper")) totalSeats = 31;
    if (bus.serviceType.toLowerCase().includes("business")) totalSeats = 35;

    // 2. Filter bookings matching Route, Date and Bus Type
    const matchedBookings = bookingHistory.filter((booking: any) => {
      const isRouteMatch = 
        booking.from.toLowerCase() === bus.from.toLowerCase() && 
        booking.to.toLowerCase() === bus.to.toLowerCase();
      
      const isDateMatch = booking.date === date;
      
      const bookingType = (booking.busType || "").toLowerCase();
      const currentBusType = (bus.serviceType || "").toLowerCase();
      const isTypeMatch = 
        (bookingType.includes("sleeper") && currentBusType.includes("sleeper")) ||
        (bookingType.includes("business") && currentBusType.includes("business")) ||
        (bookingType.includes("executive") && currentBusType.includes("executive"));

      return isRouteMatch && isDateMatch && isTypeMatch;
    });

    // 3. Count booked seats
    let bookedCount = 0;
    matchedBookings.forEach((b: any) => {
      if (b.seats && Array.isArray(b.seats)) {
        bookedCount += b.seats.length;
      }
    });

    // 4. Calculate available seats
    const availableCount = totalSeats - bookedCount;

    return {
      total: totalSeats,
      booked: bookedCount,
      available: availableCount < 0 ? 0 : availableCount
    };
  };

  const selectBus = (bus: any) => {
    const selectedBusData = { ...bus, date };
    localStorage.setItem("selectedBus", JSON.stringify(selectedBusData));
    router.push("/booking");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left" style={{ direction: "ltr" }}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">🚍 Hazara Movers Booking Desk</h1>
        <p className="text-slate-500 mt-2 text-sm">Check schedule, ticket fares, and live seat availability</p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">From</label>
            <select
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select City</option>
              <option value="Mansehra">Mansehra</option>
              <option value="Abbottabad">Abbottabad</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">To</label>
            <select
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select City</option>
              <option value="Karachi">Karachi</option>
              <option value="Mansehra">Mansehra</option>
              <option value="Abbottabad">Abbottabad</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Travel Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md"
          >
            🔍 Search Buses
          </button>
        </form>
      </div>

      {/* Search Results */}
      {isSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">
            Available Buses ({searchResults.length})
          </h2>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-4xl">⚠️</span>
              <p className="text-slate-500 mt-2 font-bold">No buses found for this route!</p>
            </div>
          ) : (
            searchResults.map((bus) => {
              const stats = getSeatStats(bus);

              return (
                <div
                  key={bus.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2 w-full md:w-auto">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
                      {bus.serviceType}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">
                      {bus.from} to {bus.to}
                    </h3>
                    <div className="flex gap-4 text-xs text-slate-400 font-semibold mt-1">
                      <span>🕒 Departure: {bus.time}</span>
                      <span>📅 Date: {date}</span>
                    </div>

                    {/* Live Seat Inventory Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 w-full max-w-sm">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 font-bold">Total Seats</p>
                        <p className="text-base font-extrabold text-slate-700 mt-0.5">{stats.total}</p>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-center">
                        <p className="text-[10px] text-emerald-600 font-bold">Available</p>
                        <p className="text-base font-extrabold text-emerald-700 mt-0.5">{stats.available}</p>
                      </div>
                      <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-center">
                        <p className="text-[10px] text-rose-600 font-bold">Booked</p>
                        <p className="text-base font-extrabold text-rose-700 mt-0.5">{stats.booked}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-start md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400 font-bold">Fare per seat</p>
                      <p className="text-2xl font-black text-emerald-600">Rs. {bus.fare.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => selectBus(bus)}
                      className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-sm w-full md:w-auto text-center"
                    >
                      Select Seats ➔
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
