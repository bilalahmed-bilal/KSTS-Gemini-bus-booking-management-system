import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ==========================================
// GET SINGLE BUS
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
        company: true,
        _count: {
          select: {
            seats: true,
          },
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
    });
  } catch (error) {
    console.error(
      "GET BUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch bus.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// UPDATE BUS
// ==========================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const {
      name,
      registrationNumber,
      busType,
      totalSeats,
      companyId,
      status,
      seatClass,
      seatLayoutType,
    } = body;

    // ==========================================
    // CHECK BUS
    // ==========================================

    const existingBus =
      await prisma.bus.findUnique({
        where: {
          id,
        },
      });

    if (!existingBus) {
      return NextResponse.json(
        {
          message:
            "Bus not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (
      !name ||
      !registrationNumber ||
      !companyId
    ) {
      return NextResponse.json(
        {
          message:
            "Bus name, registration number and company are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // TOTAL SEATS
    // ==========================================

    const parsedTotalSeats =
      Number(totalSeats);

    if (
      !Number.isInteger(
        parsedTotalSeats
      ) ||
      parsedTotalSeats <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Total seats must be a valid positive number.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALID SEAT CLASS
    // ==========================================

    const allowedSeatClasses = [
      "EXECUTIVE",
      "BUSINESS",
      "SLEEPER",
    ];

    const finalSeatClass =
      seatClass || "EXECUTIVE";

    if (
      !allowedSeatClasses.includes(
        finalSeatClass
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid seat class.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALID LAYOUT
    // ==========================================

    const allowedLayouts = [
      "TWO_BY_TWO",
      "ONE_BY_TWO",
    ];

    const finalSeatLayoutType =
      seatLayoutType ||
      (
        finalSeatClass ===
        "EXECUTIVE"
          ? "TWO_BY_TWO"
          : "ONE_BY_TWO"
      );

    if (
      !allowedLayouts.includes(
        finalSeatLayoutType
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid seat layout type.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // EXECUTIVE MUST BE 2 x 2
    // BUSINESS / SLEEPER MUST BE 1 x 2
    // ==========================================

    if (
      finalSeatClass ===
        "EXECUTIVE" &&
      finalSeatLayoutType !==
        "TWO_BY_TWO"
    ) {
      return NextResponse.json(
        {
          message:
            "Executive class must use 2 x 2 layout.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      (
        finalSeatClass ===
          "BUSINESS" ||
        finalSeatClass ===
          "SLEEPER"
      ) &&
      finalSeatLayoutType !==
        "ONE_BY_TWO"
    ) {
      return NextResponse.json(
        {
          message:
            "Business and Sleeper classes must use 1 x 2 layout.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // COMPANY CHECK
    // ==========================================

    const company =
      await prisma.company.findUnique({
        where: {
          id: companyId,
        },
      });

    if (!company) {
      return NextResponse.json(
        {
          message:
            "Company not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // DUPLICATE REGISTRATION
    // ==========================================

    const duplicateBus =
      await prisma.bus.findFirst({
        where: {
          companyId,
          registrationNumber:
            registrationNumber.trim(),
          NOT: {
            id,
          },
        },
      });

    if (duplicateBus) {
      return NextResponse.json(
        {
          message:
            "A bus with this registration number already exists for this company.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // UPDATE BUS
    // ==========================================

    const bus =
      await prisma.bus.update({
        where: {
          id,
        },

        data: {
          name: name.trim(),

          registrationNumber:
            registrationNumber.trim(),

          busType:
            busType || "STANDARD",

          totalSeats:
            parsedTotalSeats,

          companyId,

          status:
            status || "ACTIVE",

          seatClass:
            finalSeatClass,

          seatLayoutType:
            finalSeatLayoutType,
        },

        include: {
          company: true,

          _count: {
            select: {
              seats: true,
            },
          },
        },
      });

    return NextResponse.json({
      message:
        "Bus updated successfully.",

      bus,
    });
  } catch (error) {
    console.error(
      "UPDATE BUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update bus.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE BUS
// ==========================================

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const existingBus =
      await prisma.bus.findUnique({
        where: {
          id,
        },
      });

    if (!existingBus) {
      return NextResponse.json(
        {
          message:
            "Bus not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.bus.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Bus deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE BUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete bus.",
      },
      {
        status: 500,
      }
    );
  }
}

