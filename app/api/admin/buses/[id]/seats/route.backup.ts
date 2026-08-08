
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

// ==========================================
// GET BUS SEAT LAYOUT
// ==========================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const bus = await prisma.bus.findUnique({
      where: {
        id,
      },
      include: {
        seats: {
          orderBy: [
            {
              row: "asc",
            },
            {
              column: "asc",
            },
          ],
        },
      },
    });

    if (!bus) {
      return NextResponse.json(
        {
          message: "Bus not found.",
        },
        {
          status: 404,
        }
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
    console.error(
      "GET BUS SEATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch bus seat layout.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// POST / CREATE LAYOUT
// ==========================================

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const bus = await prisma.bus.findUnique({
      where: {
        id,
      },
      include: {
        seats: true,
      },
    });

    if (!bus) {
      return NextResponse.json(
        {
          message: "Bus not found.",
        },
        {
          status: 404,
        }
      );
    }

    let body: {
      action?: LayoutAction;
      row?: number;
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
          allowedActions: [
            "generate-layout",
            "add-row",
            "add-seat",
          ],
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // GENERATE COMPLETE LAYOUT
    // ==========================================

    if (action === "generate-layout") {
      // Delete old layout first
      await prisma.busSeat.deleteMany({
        where: {
          busId: id,
        },
      });

      const seats: Array<{
        seatNumber: string;
        row: number;
        column: number;
        seatType: SeatType;
        sleeperGroup: number | null;
        seatClass: SeatClass;
        busId: string;
      }> = [];

      let seatNumber = 1;

      // ========================================
      // EXECUTIVE
      // 2 x 2
      //
      // 1 2 | 3 4
      // 5 6 | 7 8
      // ========================================

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
              seatClass:
                "EXECUTIVE",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      // ========================================
      // BUSINESS
      // 1 x 2
      //
      // 1 | 2 3
      // 4 | 5 6
      // 7 | 8 9
      // ========================================

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
              seatClass:
                "BUSINESS",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      // ========================================
      // SLEEPER
      //
      // GROUP 1
      //
      // 1 | 2 3   UPPER
      // 4 | 5 6   LOWER
      //
      // GROUP 2
      //
      // 7 | 8 9   UPPER
      // 10| 11 12 LOWER
      //
      // Every 6 beds = one group
      // ========================================

      if (bus.seatClass === "SLEEPER") {
        const bedsPerGroup = 6;

        const groups = Math.ceil(
          bus.totalSeats /
            bedsPerGroup
        );

        for (
          let group = 1;
          group <= groups;
          group++
        ) {
          // -------------------------------
          // UPPER ROW
          // -------------------------------

          const upperRow =
            (group - 1) * 2 + 1;

          // Left upper bed
          if (
            seatNumber <=
            bus.totalSeats
          ) {
            seats.push({
              seatNumber:
                String(seatNumber),
              row: upperRow,
              column: 1,
              seatType:
                "UPPER_BED",
              sleeperGroup:
                group,
              seatClass:
                "SLEEPER",
              busId: id,
            });

            seatNumber++;
          }

          // Right upper beds
          for (
            let column = 2;
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
              row: upperRow,
              column,
              seatType:
                "UPPER_BED",
              sleeperGroup:
                group,
              seatClass:
                "SLEEPER",
              busId: id,
            });

            seatNumber++;
          }

          // -------------------------------
          // LOWER ROW
          // -------------------------------

          const lowerRow =
            (group - 1) * 2 + 2;

          // Left lower bed
          if (
            seatNumber <=
            bus.totalSeats
          ) {
            seats.push({
              seatNumber:
                String(seatNumber),
              row: lowerRow,
              column: 1,
              seatType:
                "LOWER_BED",
              sleeperGroup:
                group,
              seatClass:
                "SLEEPER",
              busId: id,
            });

            seatNumber++;
          }

          // Right lower beds
          for (
            let column = 2;
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
              row: lowerRow,
              column,
              seatType:
                "LOWER_BED",
              sleeperGroup:
                group,
              seatClass:
                "SLEEPER",
              busId: id,
            });

            seatNumber++;
          }
        }
      }

      // ========================================
      // SAVE LAYOUT
      // ========================================

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
        {
          status: 201,
        }
      );
    }

    // ==========================================
    // ADD ROW
    // ==========================================

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

      const seatsToAdd: Array<{
        seatNumber: string;
        row: number;
        column: number;
        seatType: SeatType;
        sleeperGroup: number | null;
        seatClass: SeatClass;
        busId: string;
      }> = [];

      // Executive = 4
      if (
        bus.seatClass ===
        "EXECUTIVE"
      ) {
        for (
          let column = 1;
          column <= 4;
          column++
        ) {
          seatsToAdd.push({
            seatNumber: String(
              highestNumber +
                column
            ),
            row: newRow,
            column,
            seatType: "SEAT",
            sleeperGroup: null,
            seatClass:
              "EXECUTIVE",
            busId: id,
          });
        }
      }

      // Business = 3
      if (
        bus.seatClass ===
        "BUSINESS"
      ) {
        for (
          let column = 1;
          column <= 3;
          column++
        ) {
          seatsToAdd.push({
            seatNumber: String(
              highestNumber +
                column
            ),
            row: newRow,
            column,
            seatType: "SEAT",
            sleeperGroup: null,
            seatClass:
              "BUSINESS",
            busId: id,
          });
        }
      }

      // Sleeper = upper/lower
      if (
        bus.seatClass ===
        "SLEEPER"
      ) {
        const group =
          Math.floor(
            newRow / 2
          ) + 1;

        const type =
          newRow % 2 === 1
            ? "UPPER_BED"
            : "LOWER_BED";

        for (
          let column = 1;
          column <= 3;
          column++
        ) {
          seatsToAdd.push({
            seatNumber: String(
              highestNumber +
                column
            ),
            row: newRow,
            column,
            seatType: type,
            sleeperGroup:
              group,
            seatClass:
              "SLEEPER",
            busId: id,
          });
        }
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
        {
          status: 201,
        }
      );
    }

    // ==========================================
    // DELETE ONE SEAT
    // ==========================================

    if (
      action === "delete-seat"
    ) {
      const seatId =
        (body as any).seatId;

      if (!seatId) {
        return NextResponse.json(
          {
            message:
              "Seat ID is required.",
          },
          {
            status: 400,
          }
        );
      }

      const seat =
        await prisma.busSeat.findFirst(
          {
            where: {
              id: seatId,
              busId: id,
            },
          }
        );

      if (!seat) {
        return NextResponse.json(
          {
            message:
              "Seat not found.",
          },
          {
            status: 404,
          }
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

    // ==========================================
    // DELETE ROW
    // ==========================================

    if (
      action === "delete-row"
    ) {
      const targetRow =
        Number(body.row);

      if (
        !Number.isInteger(
          targetRow
        ) ||
        targetRow <= 0
      ) {
        return NextResponse.json(
          {
            message:
              "Valid row number is required.",
          },
          {
            status: 400,
          }
        );
      }

      const deleted =
        await prisma.busSeat.deleteMany(
          {
            where: {
              busId: id,
              row: targetRow,
            },
          }
        );

      return NextResponse.json({
        message:
          "Seat row deleted successfully.",
        deletedCount:
          deleted.count,
      });
    }

    // ==========================================
    // DELETE ALL
    // ==========================================

    if (
      action === "delete-all"
    ) {
      const deleted =
        await prisma.busSeat.deleteMany(
          {
            where: {
              busId: id,
            },
          }
        );

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
      {
        status: 400,
      }
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
      {
        status: 500,
      }
    );
  }
}

