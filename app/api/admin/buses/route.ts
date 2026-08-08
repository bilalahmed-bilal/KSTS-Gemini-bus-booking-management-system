import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==========================================
// GET ALL BUSES
// ==========================================

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      include: {
        company: true,
        _count: {
          select: {
            seats: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      buses,
    });
  } catch (error) {
    console.error("GET BUSES ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch buses",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE BUS
// ==========================================

export async function POST(request: Request) {
  try {
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

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!companyId) {
      return NextResponse.json(
        {
          message: "Company is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedTotalSeats = Number(totalSeats);

    if (
      !Number.isInteger(parsedTotalSeats) ||
      parsedTotalSeats <= 0
    ) {
      return NextResponse.json(
        {
          message: "Total seats must be a valid positive number.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------
    // CHECK COMPANY
    // --------------------------------------

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          message: "Company not found.",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------
    // CREATE BUS
    // --------------------------------------

    const bus = await prisma.bus.create({
      data: {
        name: name?.trim() || null,
        registrationNumber:
          registrationNumber?.trim() || null,

        busType: busType || "STANDARD",
        totalSeats: parsedTotalSeats,
        status: status || "ACTIVE",

        seatClass: seatClass || "EXECUTIVE",

        seatLayoutType:
          seatLayoutType || "TWO_BY_TWO",

        companyId,
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

    return NextResponse.json(
      {
        message: "Bus created successfully.",
        bus,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE BUS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create bus.",
      },
      {
        status: 500,
      }
    );
  }
}