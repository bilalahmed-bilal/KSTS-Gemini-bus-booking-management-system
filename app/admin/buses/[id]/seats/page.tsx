"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Bus,
  Armchair,
  BedDouble,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  seatType: string;
}

type RowAction =
  | "add-row"
  | "add-upper-row"
  | "add-lower-row"
  | "add-last-row";

export default function BusSeatsPage() {
  const params = useParams();

  const busId = params.id as string;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [totalSeats, setTotalSeats] = useState(0);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD SEATS
  // ==========================================

  useEffect(() => {
    if (!busId) return;

    loadSeats();
  }, [busId]);

  async function loadSeats() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load seat layout."
        );
        return;
      }

      setSeats(data.seats || []);
      setTotalSeats(data.totalSeats || 0);
    } catch (error) {
      console.error(
        "LOAD SEATS ERROR:",
        error
      );

      setError(
        "Failed to load seat layout."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // ADD ROW
  // ==========================================

  async function addRow(
    action: RowAction
  ) {
    try {
      setAdding(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to add row."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Row added successfully."
      );

      await loadSeats();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "ADD ROW ERROR:",
        error
      );

      setError(
        "Failed to add row."
      );
    } finally {
      setAdding(false);
    }
  }

  // ==========================================
  // ADD ONE SEAT TO ROW
  // ==========================================

  async function addSeat(
    rowNumber: number
  ) {
    try {
      setAdding(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "add-seat",
            row: rowNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to add seat."
        );
        return;
      }

      setSuccess(
        `Seat ${
          data.seat?.seatNumber || ""
        } added to Row ${rowNumber}.`
      );

      await loadSeats();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "ADD SEAT ERROR:",
        error
      );

      setError(
        "Failed to add seat."
      );
    } finally {
      setAdding(false);
    }
  }

  // ==========================================
  // DELETE ONE SEAT
  // ==========================================

  async function deleteSeat(
    seat: Seat
  ) {
    const confirmed = window.confirm(
      `Delete Seat ${seat.seatNumber}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "delete-seat",
            seatId: seat.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to delete seat."
        );
        return;
      }

      setSuccess(
        data.message ||
          `Seat ${seat.seatNumber} deleted successfully.`
      );

      await loadSeats();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "DELETE SEAT ERROR:",
        error
      );

      setError(
        "Failed to delete seat."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // DELETE ROW
  // ==========================================

  async function deleteRow(
    rowNumber: number
  ) {
    const rowSeats = seats.filter(
      (seat) =>
        seat.row === rowNumber
    );

    const confirmed = window.confirm(
      `Delete Row ${rowNumber}?\n\nThis will delete ${rowSeats.length} seat(s)/bed(s) from this row.\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "delete-row",
            row: rowNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to delete row."
        );
        return;
      }

      setSuccess(
        data.message ||
          `Row ${rowNumber} deleted successfully.`
      );

      await loadSeats();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "DELETE ROW ERROR:",
        error
      );

      setError(
        "Failed to delete row."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // DELETE ALL LAYOUT
  // ==========================================

  async function deleteAllSeats() {
    if (seats.length === 0) {
      setError(
        "There are no seats or beds to delete."
      );
      return;
    }

    const confirmed = window.confirm(
      `DELETE ALL LAYOUT?\n\nThis will permanently delete all ${seats.length} seats/beds from this bus.\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/buses/${busId}/seats`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "delete-all",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to delete layout."
        );
        return;
      }

      setSuccess(
        data.message ||
          "All seats and beds deleted successfully."
      );

      await loadSeats();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "DELETE ALL ERROR:",
        error
      );

      setError(
        "Failed to delete all seats."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ==========================================
  // LABEL
  // ==========================================

  function getSeatTypeLabel(
    seatType: string
  ) {
    switch (seatType) {
      case "UPPER_BED":
        return "Upper Bed";

      case "LOWER_BED":
        return "Lower Bed";

      case "LAST_ROW_SEAT":
        return "Last Row";

      default:
        return "Seat";
    }
  }

  // ==========================================
  // ICON
  // ==========================================

  function getSeatTypeIcon(
    seatType: string
  ) {
    if (
      seatType === "UPPER_BED" ||
      seatType === "LOWER_BED"
    ) {
      return (
        <BedDouble size={20} />
      );
    }

    return (
      <Armchair size={20} />
    );
  }

  // ==========================================
  // ROWS
  // ==========================================

  const rows = Array.from(
    new Set(
      seats.map(
        (seat) => seat.row
      )
    )
  ).sort(
    (a, b) => a - b
  );

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <Link
          href="/admin/buses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Buses
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
              <Bus size={30} />
              Bus Seat Layout
            </h1>

            <p className="mt-1 text-slate-500">
              Manually build and manage
              the complete seat and
              sleeper layout.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Layout Seats
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {seats.length}
            </p>

            <p className="text-xs text-slate-400">
              Capacity: {totalSeats}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* ADD ROW PANEL */}

      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Add Layout Row
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Har row manually add
              karein. System
              automatically seats create
              nahi karega.
            </p>
          </div>

          {seats.length > 0 && (
            <button
              type="button"
              onClick={
                deleteAllSeats
              }
              disabled={
                deleting ||
                adding
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />
              Delete All Layout
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* NORMAL ROW */}

          <button
            type="button"
            onClick={() =>
              addRow("add-row")
            }
            disabled={
              adding || deleting
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Seat Row
          </button>

          {/* UPPER */}

          <button
            type="button"
            onClick={() =>
              addRow(
                "add-upper-row"
              )
            }
            disabled={
              adding || deleting
            }
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Upper Bed Row
          </button>

          {/* LOWER */}

          <button
            type="button"
            onClick={() =>
              addRow(
                "add-lower-row"
              )
            }
            disabled={
              adding || deleting
            }
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Lower Bed Row
          </button>

          {/* LAST ROW */}

          <button
            type="button"
            onClick={() =>
              addRow(
                "add-last-row"
              )
            }
            disabled={
              adding || deleting
            }
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Last Row
          </button>
        </div>
      </div>

      {/* BUS LAYOUT */}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {/* FRONT */}

        <div className="mb-8 text-center">
          <div className="mx-auto max-w-md rounded-lg bg-slate-800 px-5 py-3 text-sm font-bold tracking-wide text-white">
            FRONT
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading seat layout...
          </div>
        ) : rows.length === 0 ? (
          /* EMPTY */

          <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center">
            <Bus
              size={40}
              className="mx-auto mb-3 text-slate-400"
            />

            <p className="font-semibold text-slate-700">
              No seat layout found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Use the buttons above
              to manually add rows.
            </p>
          </div>
        ) : (
          /* ROWS */

          <div className="mx-auto max-w-4xl space-y-4">
            {rows.map(
              (rowNumber) => {
                const rowSeats =
                  seats
                    .filter(
                      (seat) =>
                        seat.row ===
                        rowNumber
                    )
                    .sort(
                      (a, b) =>
                        a.column -
                        b.column
                    );

                const isBedRow =
                  rowSeats.some(
                    (seat) =>
                      seat.seatType ===
                        "UPPER_BED" ||
                      seat.seatType ===
                        "LOWER_BED"
                  );

                const isLastRow =
                  rowSeats.some(
                    (seat) =>
                      seat.seatType ===
                      "LAST_ROW_SEAT"
                  );

                return (
                  <div
                    key={rowNumber}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    {/* ROW HEADER */}

                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800">
                          Row{" "}
                          {rowNumber}
                        </span>

                        <span className="ml-2 text-xs text-slate-500">
                          {
                            rowSeats.length
                          }{" "}
                          {isBedRow
                            ? "beds"
                            : "seats"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          {isBedRow
                            ? getSeatTypeLabel(
                                rowSeats[0]
                                  ?.seatType ||
                                  ""
                              )
                            : isLastRow
                            ? "Last Row"
                            : "Seat Row"}
                        </span>

                        {/* ADD SEAT */}

                        <button
                          type="button"
                          onClick={() =>
                            addSeat(
                              rowNumber
                            )
                          }
                          disabled={
                            adding ||
                            deleting
                          }
                          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus
                            size={14}
                          />
                          Add Seat
                        </button>

                        {/* DELETE ROW */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteRow(
                              rowNumber
                            )
                          }
                          disabled={
                            deleting ||
                            adding
                          }
                          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={14}
                          />
                          Delete Row
                        </button>
                      </div>
                    </div>

                    {/* SEAT AREA */}

                    <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-3">
                      {rowSeats.map(
                        (seat) => (
                          <div
                            key={seat.id}
                            className={`group relative flex h-16 w-16 flex-col items-center justify-center rounded-lg border shadow-sm ${
                              seat.seatType ===
                              "UPPER_BED"
                                ? "border-purple-300 bg-purple-50 text-purple-700"
                                : seat.seatType ===
                                  "LOWER_BED"
                                ? "border-violet-300 bg-violet-50 text-violet-700"
                                : seat.seatType ===
                                  "LAST_ROW_SEAT"
                                ? "border-slate-400 bg-white text-slate-700"
                                : "border-slate-300 bg-white text-slate-700"
                            }`}
                          >
                            {getSeatTypeIcon(
                              seat.seatType
                            )}

                            <span className="mt-1 text-sm font-bold">
                              {
                                seat.seatNumber
                              }
                            </span>

                            {/* DELETE INDIVIDUAL SEAT */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteSeat(
                                  seat
                                )
                              }
                              disabled={
                                deleting ||
                                adding
                              }
                              title={`Delete Seat ${seat.seatNumber}`}
                              className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 group-hover:flex disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2
                                size={13}
                              />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* REAR */}

        <div className="mt-8 text-center">
          <div className="mx-auto max-w-md rounded-lg bg-slate-200 px-5 py-3 text-sm font-bold tracking-wide text-slate-700">
            REAR
          </div>
        </div>
      </div>
    </div>
  );
}

