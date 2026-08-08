
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// ===============================
// GET SINGLE USER
// ===============================

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
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

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// UPDATE USER
// ===============================

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
      email,
      password,
      role,
      companyId,
      officeId,
      isActive,
    } = body;

    // -------------------------------
    // Check user exists
    // -------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // -------------------------------
    // Check duplicate email
    // -------------------------------

    if (
      email &&
      email !== existingUser.email
    ) {
      const emailUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailUser) {
        return NextResponse.json(
          {
            message: "Email already exists",
          },
          {
            status: 400,
          }
        );
      }
    }

    // -------------------------------
    // Prepare update data
    // -------------------------------

    const updateData: {
      name?: string;
      email?: string;
      role?: Role;
      isActive?: boolean;
      password?: string;
      company?: {
        connect: {
          id: string;
        };
        disconnect?: never;
      } | {
        disconnect: true;
        connect?: never;
      };
      office?: {
        connect: {
          id: string;
        };
        disconnect?: never;
      } | {
        disconnect: true;
        connect?: never;
      };
    } = {};

    // -------------------------------
    // Basic fields
    // -------------------------------

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (role !== undefined) {
      if (
        !Object.values(Role).includes(role)
      ) {
        return NextResponse.json(
          {
            message: "Invalid user role",
          },
          {
            status: 400,
          }
        );
      }

      updateData.role = role as Role;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // -------------------------------
    // Company relation
    // -------------------------------

    if (companyId !== undefined) {
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

        updateData.company = {
          connect: {
            id: companyId,
          },
        };
      } else {
        updateData.company = {
          disconnect: true,
        };
      }
    }

    // -------------------------------
    // Office relation
    // -------------------------------

    if (officeId !== undefined) {
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

        // Make sure selected office belongs
        // to selected company when companyId
        // is supplied in this request.
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

        updateData.office = {
          connect: {
            id: officeId,
          },
        };
      } else {
        updateData.office = {
          disconnect: true,
        };
      }
    }

    // -------------------------------
    // Update password only if entered
    // -------------------------------

    if (
      password &&
      password.trim() !== ""
    ) {
      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      updateData.password = hashedPassword;
    }

    // -------------------------------
    // Update user
    // -------------------------------

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
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

    // -------------------------------
    // Never return password
    // -------------------------------

    const {
      password: _password,
      ...safeUser
    } = user;

    return NextResponse.json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(
      "UPDATE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

// ===============================
// DELETE USER
// ===============================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    // -------------------------------
    // Check user exists
    // -------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // -------------------------------
    // Delete user
    // -------------------------------

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}
