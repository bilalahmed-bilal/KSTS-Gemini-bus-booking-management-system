import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalCompanies,
      activeCompanies,
      totalUsers,
      activeUsers,
    ] = await Promise.all([
      prisma.company.count(),

      prisma.company.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalCompanies,
        activeCompanies,
        totalUsers,
        activeUsers,

        // Buses aur bookings abhi database
        // module mein available nahi hain.
        totalBuses: 0,
        totalBookings: 0,
      },
    });
  } catch (error) {
    console.error(
      "DASHBOARD STATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load dashboard statistics",
      },
      {
        status: 500,
      }
    );
  }
}