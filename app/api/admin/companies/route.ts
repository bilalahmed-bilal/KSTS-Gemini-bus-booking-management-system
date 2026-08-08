import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET ALL COMPANIES
export async function GET() {
  try {

    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });


    return NextResponse.json({
      companies,
    });


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch companies",
      },
      {
        status: 500,
      }
    );

  }
}



// CREATE COMPANY
export async function POST(request: Request) {

  try {

    const body = await request.json();


    const {
      name,
      logo,
      phone,
      email,
      address,
    } = body;



    if (!name) {

      return NextResponse.json(
        {
          message: "Company name is required",
        },
        {
          status: 400,
        }
      );

    }



    const company = await prisma.company.create({

      data: {

        name,

        logo,

        phone,

        email,

        address,

      },

    });



    return NextResponse.json({

      message: "Company created successfully",

      company,

    });



  } catch (error) {


    console.error(error);


    return NextResponse.json(

      {
        message: "Failed to create company",
      },

      {
        status: 500,
      }

    );

  }

}