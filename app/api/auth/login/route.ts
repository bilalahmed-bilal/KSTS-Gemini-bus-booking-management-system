import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { createSession } from "../../../../lib/auth";


export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { email, password } = body;


    if (!email || !password) {

      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );

    }



    const user = await prisma.user.findUnique({

      where: {
        email,
      },

    });



    if (!user) {

      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );

    }



    if (!user.isActive) {

      return NextResponse.json(
        {
          message: "Account is inactive",
        },
        {
          status: 403,
        }
      );

    }



    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );



    if (!passwordMatch) {

      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );

    }



    await prisma.user.update({

      where: {
        id: user.id,
      },

      data: {
        lastLoginAt: new Date(),
      },

    });



    // Create Secure Session

    const session = await createSession({

      id: user.id,

      email: user.email,

      role: user.role,

      name: user.name,

    });



    // Save Session Cookie

    const cookieStore = await cookies();


    cookieStore.set(
      "session",
      session,
      {

        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "lax",

        maxAge:
          60 * 60 * 24 * 7,

        path: "/",

      }
    );



    return NextResponse.json({

      message: "Login successful",

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });



  } catch (error) {


    console.error(error);



    return NextResponse.json(

      {
        message: "Server error",
      },

      {
        status: 500,
      }

    );


  }

}