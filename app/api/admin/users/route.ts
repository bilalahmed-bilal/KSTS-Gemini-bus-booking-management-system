import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ==========================================
// GET USERS LIST
// ==========================================

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        companyId: true,
        officeId: true,
        createdAt: true,
        updatedAt: true,

        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true,
            email: true,
            address: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        office: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE USER
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      role,
      companyId,
      officeId,
    } = body;

    // ------------------------------------------
    // Basic validation
    // ------------------------------------------

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          message:
            "Name, email, password and role are required",
        },
        {
          status: 400,
        }
      );
    }

    // ------------------------------------------
    // Check existing email
    // ------------------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    // ------------------------------------------
    // Check company
    // ------------------------------------------

    if (companyId) {
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
    }

    // ------------------------------------------
    // Check office
    // ------------------------------------------

    if (officeId) {
      const office = await prisma.office.findUnique({
        where: {
          id: officeId,
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

      if (
        companyId &&
        office.companyId !== companyId
      ) {
        return NextResponse.json(
          {
            message:
              "Selected office does not belong to the selected company",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ------------------------------------------
    // Password hash
    // ------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ------------------------------------------
    // Create user
    // ------------------------------------------

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyId: companyId || null,
        officeId: officeId || null,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        companyId: true,
        officeId: true,
        createdAt: true,
        updatedAt: true,

        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true,
            email: true,
            address: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        office: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}