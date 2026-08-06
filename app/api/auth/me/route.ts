import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "../../../../lib/auth";


export async function GET() {

  try {

    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;


    if (!token) {

      return NextResponse.json(
        {
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );

    }


    const session = await verifySession(token);


    if (!session) {

      return NextResponse.json(
        {
          message: "Invalid session",
        },
        {
          status: 401,
        }
      );

    }


    return NextResponse.json({

      user: {

        id: session.id,

        name: session.name,

        email: session.email,

        role: session.role,

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