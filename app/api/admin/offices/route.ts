import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL OFFICES
export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      offices,
    });
  } catch (error) {
    console.error("GET OFFICES ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch offices",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE OFFICE
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      code,
      city,
      address,
      phone,
      companyId,
      status,
    } = body;

    if (!name || !code || !city || !companyId) {
      return NextResponse.json(
        {
          message:
            "Name, code, city and company are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check company
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          message: "Company not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check duplicate office code
    const existingOffice =
      await prisma.office.findUnique({
        where: {
          companyId_code: {
            companyId,
            code,
          },
        },
      });

    if (existingOffice) {
      return NextResponse.json(
        {
          message:
            "This office code already exists for this company",
        },
        {
          status: 400,
        }
      );
    }

    const office = await prisma.office.create({
      data: {
        name,
        code,
        city,
        address: address || null,
        phone: phone || null,
        companyId,
        status: status || "ACTIVE",
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Office created successfully",
        office,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE OFFICE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create office",
      },
      {
        status: 500,
      }
    );
  }
}