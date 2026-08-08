
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

type SeatClass =
  | "EXECUTIVE"
  | "BUSINESS"
  | "SLEEPER";

type SeatType =
  | "SEAT"
  | "UPPER_BED"
  | "LOWER_BED";

type LayoutAction =
  | "generate-layout"
  | "add-row"
  | "add-seat"
  | "delete-seat"
  | "delete-row"
  | "delete-all";

type NewSeat = {
  seatNumber: string;
  row: number;
  column: number;
  seatType: SeatType;
  sleeperGroup: number | null;
  seatClass: SeatClass;
  busId: string;
};

function getSeatsPerRow(seatClass: SeatClass) {
  if (seatClass === "EXECUTIVE") return 4;
  return 3;
}

function getSleeperGroup(row: number) {
  return Math.floor((row - 1) / 2) + 1;
}

function getSleeperSeatType(row: number): SeatType {
  return row % 2 === 1
    ? "UPPER_BED"
    : "LOWER_BED";
}

// ==========================================
// GET
// ==========================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const bus = await prisma.bus.findUnique({
      where: { id },
      include: {
        seats: {
          orderBy: [
            { row: "asc" },
            { column: "asc" },
          ],
        },
      },
    });

    if (!bus) {
      return NextResponse.json(
        { message: "Bus not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bus,
      seats: bus.seats,
      totalSeats: bus.totalSeats,
      seatCount: bus.seats.length,
      seatClass: bus.seatClass,
      seatLayoutType: bus.seatLayoutType,
    });
  } catch (error) {
    console.error("GET BUS SEATS ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Failed to fetch bus seat layout.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// POST
// ==========================================

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const bus = await prisma.bus.findUnique({
      where: { id },
      include: {
        seats: true,
      },
    });

    if (!bus) {
      return NextResponse.json(
        { message: "Bus not found." },
        { status: 404 }
      );
    }

    let body: {
      action?: LayoutAction;
      row?: number;
      seatId?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const action = body.action;

    if (!action) {
      return NextResponse.json(
        {
          message:
            "Layout action is required.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // GENERATE COMPLETE LAYOUT
    // ========================================

    if (action === "generate-layout") {
      await prisma.busSeat.deleteMany({
        where: {
          busId: id,
        },
      });

      const seats: NewSeat[] = [];

      let seatNumber = 1;

      // ======================================
      // EXECUTIVE
      //
      // 1 2 | 3 4
      // 5 6 | 7 8
      // ======================================

      if (bus.seatClass === "EXECUTIVE") {
        const rows = Math.ceil(
          bus.totalSeats / 4
        );

        for (
          let row = 1;
          row <= rows;
          row++
        ) {
          for (
            let column = 1;
            column <= 4;
            column++
          ) {
            if (
              seatNumber >
              bus.totalSeats
            ) {
              break;
            }

            seats.push({
              seatNumber:
                String(seatNumber),
              row,
              column,
              seatType: "SEAT",
              sleeperGroup: null,
              seatClass: "EXECUTIVE",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      // ======================================
      // BUSINESS
      //
      // 1 | 2 3
      // 4 | 5 6
      // 7 | 8 9
      // ======================================

      if (bus.seatClass === "BUSINESS") {
        const rows = Math.ceil(
          bus.totalSeats / 3
        );

        for (
          let row = 1;
          row <= rows;
          row++
        ) {
          for (
            let column = 1;
            column <= 3;
            column++
          ) {
            if (
              seatNumber >
              bus.totalSeats
            ) {
              break;
            }

            seats.push({
              seatNumber:
                String(seatNumber),
              row,
              column,
              seatType: "SEAT",
              sleeperGroup: null,
              seatClass: "BUSINESS",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      // ======================================
      // SLEEPER
      //
      // GROUP 1
      //
      // 1 | 2 3   UPPER
      // 4 | 5 6   LOWER
      //
      // GROUP 2
      //
      // 7 | 8 9    UPPER
      // 10| 11 12  LOWER
      // ======================================

      if (bus.seatClass === "SLEEPER") {
        const rows = Math.ceil(
          bus.totalSeats / 3
        );

        for (
          let row = 1;
          row <= rows;
          row++
        ) {
          const group =
            getSleeperGroup(row);

          const seatType =
            getSleeperSeatType(row);

          for (
            let column = 1;
            column <= 3;
            column++
          ) {
            if (
              seatNumber >
              bus.totalSeats
            ) {
              break;
            }

            seats.push({
              seatNumber:
                String(seatNumber),
              row,
              column,
              seatType,
              sleeperGroup:
                group,
              seatClass: "SLEEPER",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      if (seats.length > 0) {
        await prisma.busSeat.createMany({
          data: seats,
        });
      }

      return NextResponse.json(
        {
          message:
            "Bus seat layout generated successfully.",
          seatClass:
            bus.seatClass,
          seatLayoutType:
            bus.seatLayoutType,
          totalSeats:
            seats.length,
          seats,
        },
        { status: 201 }
      );
    }

    // ========================================
    // ADD ROW
    // ========================================

    if (action === "add-row") {
      const existingSeats =
        await prisma.busSeat.findMany({
          where: {
            busId: id,
          },
          orderBy: {
            seatNumber: "desc",
          },
        });

      const highestRow =
        existingSeats.reduce(
          (max, seat) =>
            Math.max(
              max,
              seat.row
            ),
          0
        );

      const highestNumber =
        existingSeats.reduce(
          (max, seat) =>
            Math.max(
              max,
              Number(
                seat.seatNumber
              ) || 0
            ),
          0
        );

      const newRow =
        highestRow + 1;

      const seatsPerRow =
        getSeatsPerRow(
          bus.seatClass as SeatClass
        );

      const seatsToAdd: NewSeat[] = [];

      for (
        let column = 1;
        column <= seatsPerRow;
        column++
      ) {
        let seatType: SeatType =
          "SEAT";

        let sleeperGroup:
          | number
          | null = null;

        if (
          bus.seatClass ===
          "SLEEPER"
        ) {
          seatType =
            getSleeperSeatType(
              newRow
            );

          sleeperGroup =
            getSleeperGroup(
              newRow
            );
        }

        seatsToAdd.push({
          seatNumber: String(
            highestNumber +
              column
          ),
          row: newRow,
          column,
          seatType,
          sleeperGroup,
          seatClass:
            bus.seatClass as SeatClass,
          busId: id,
        });
      }

      // Capacity check
      if (
        existingSeats.length +
          seatsToAdd.length >
        bus.totalSeats
      ) {
        return NextResponse.json(
          {
            message:
              `Cannot add row. Bus capacity is ${bus.totalSeats} seats.`,
          },
          { status: 400 }
        );
      }

      await prisma.busSeat.createMany({
        data: seatsToAdd,
      });

      return NextResponse.json(
        {
          message:
            "New seat row added successfully.",
          seats:
            seatsToAdd,
        },
        { status: 201 }
      );
    }

    // ========================================
    // ADD ONE SEAT
    // ========================================

    if (action === "add-seat") {
      const rowNumber =
        Number(body.row);

      if (
        !Number.isInteger(
          rowNumber
        ) ||
        rowNumber <= 0
      ) {
        return NextResponse.json(
          {
            message:
              "Valid row number is required.",
          },
          { status: 400 }
        );
      }

      const existingRowSeats =
        await prisma.busSeat.findMany({
          where: {
            busId: id,
            row: rowNumber,
          },
          orderBy: {
            column: "asc",
          },
        });

      const seatsPerRow =
        getSeatsPerRow(
          bus.seatClass as SeatClass
        );

      if (
        existingRowSeats.length >=
        seatsPerRow
      ) {
        return NextResponse.json(
          {
            message:
              "This row is already full.",
          },
          { status: 400 }
        );
      }

      const allSeats =
        await prisma.busSeat.findMany({
          where: {
            busId: id,
          },
        });

      if (
        allSeats.length >=
        bus.totalSeats
      ) {
        return NextResponse.json(
          {
            message:
              "Bus seat capacity is already full.",
          },
          { status: 400 }
        );
      }

      const highestNumber =
        allSeats.reduce(
          (max, seat) =>
            Math.max(
              max,
              Number(
                seat.seatNumber
              ) || 0
            ),
          0
        );

      const usedColumns =
        existingRowSeats.map(
          (seat) => seat.column
        );

      let newColumn = 1;

      while (
        usedColumns.includes(
          newColumn
        )
      ) {
        newColumn++;
      }

      let seatType: SeatType =
        "SEAT";

      let sleeperGroup:
        | number
        | null = null;

      if (
        bus.seatClass ===
        "SLEEPER"
      ) {
        seatType =
          getSleeperSeatType(
            rowNumber
          );

        sleeperGroup =
          getSleeperGroup(
            rowNumber
          );
      }

      const newSeat =
        await prisma.busSeat.create({
          data: {
            seatNumber: String(
              highestNumber + 1
            ),
            row: rowNumber,
            column: newColumn,
            seatType,
            sleeperGroup,
            seatClass:
              bus.seatClass as SeatClass,
            busId: id,
          },
        });

      return NextResponse.json(
        {
          message:
            "Seat added successfully.",
          seat: newSeat,
        },
        { status: 201 }
      );
    }

    // ========================================
    // DELETE ONE SEAT
    // ========================================

    if (
      action ===
      "delete-seat"
    ) {
      if (!body.seatId) {
        return NextResponse.json(
          {
            message:
              "Seat ID is required.",
          },
          { status: 400 }
        );
      }

      const seat =
        await prisma.busSeat.findFirst({
          where: {
            id: body.seatId,
            busId: id,
          },
        });

      if (!seat) {
        return NextResponse.json(
          {
            message:
              "Seat not found.",
          },
          { status: 404 }
        );
      }

      await prisma.busSeat.delete({
        where: {
          id: seat.id,
        },
      });

      return NextResponse.json({
        message:
          "Seat deleted successfully.",
      });
    }

    // ========================================
    // DELETE ROW
    // ========================================

    if (
      action ===
      "delete-row"
    ) {
      const rowNumber =
        Number(body.row);

      if (
        !Number.isInteger(
          rowNumber
        ) ||
        rowNumber <= 0
      ) {
        return NextResponse.json(
          {
            message:
              "Valid row number is required.",
          },
          { status: 400 }
        );
      }

      const deleted =
        await prisma.busSeat.deleteMany({
          where: {
            busId: id,
            row: rowNumber,
          },
        });

      return NextResponse.json({
        message:
          "Seat row deleted successfully.",
        deletedCount:
          deleted.count,
      });
    }

    // ========================================
    // DELETE ALL
    // ========================================

    if (
      action ===
      "delete-all"
    ) {
      const deleted =
        await prisma.busSeat.deleteMany({
          where: {
            busId: id,
          },
        });

      return NextResponse.json({
        message:
          "All seats and beds deleted successfully.",
        deletedCount:
          deleted.count,
      });
    }

    return NextResponse.json(
      {
        message:
          "Invalid layout action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "BUS LAYOUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update bus seat layout.",
      },
      { status: 500 }
    );
  }
}

