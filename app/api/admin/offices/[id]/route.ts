import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SINGLE OFFICE
export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const office = await prisma.office.findUnique({
      where: {
        id,
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

    if (!office) {
      return NextResponse.json(
        {
          message: "Office not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      office,
    });
  } catch (error) {
    console.error("GET OFFICE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch office",
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE OFFICE
export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

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

    const existingOffice = await prisma.office.findUnique({
      where: {
        id,
      },
    });

    if (!existingOffice) {
      return NextResponse.json(
        {
          message: "Office not found",
        },
        {
          status: 404,
        }
      );
    }

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

    const normalizedCode = code.trim().toUpperCase();

    const duplicateOffice =
      await prisma.office.findFirst({
        where: {
          companyId,
          code: normalizedCode,
          NOT: {
            id,
          },
        },
      });

    if (duplicateOffice) {
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

    const office = await prisma.office.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        code: normalizedCode,
        city: city.trim(),
        address: address?.trim() || null,
        phone: phone?.trim() || null,
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

    return NextResponse.json({
      message: "Office updated successfully",
      office,
    });
  } catch (error) {
    console.error("UPDATE OFFICE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update office",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE OFFICE
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const existingOffice = await prisma.office.findUnique({
      where: {
        id,
      },
    });

    if (!existingOffice) {
      return NextResponse.json(
        {
          message: "Office not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.office.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Office deleted successfully",
    });
  } catch (error) {
    console.error("DELETE OFFICE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to delete office",
      },
      {
        status: 500,
      }
    );
  }
}