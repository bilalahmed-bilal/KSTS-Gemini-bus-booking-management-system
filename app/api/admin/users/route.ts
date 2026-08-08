import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


// GET USERS LIST

export async function GET() {

  try {


    const users = await prisma.user.findMany({

      include: {

        company: true,

      },


      orderBy: {

        createdAt: "desc",

      },

    });



    return NextResponse.json({

      users,

    });



  } catch(error) {


    console.error(error);



    return NextResponse.json(

      {
        message:"Failed to fetch users",
      },

      {
        status:500,
      }

    );


  }

}





// CREATE USER

export async function POST(
  request: Request
) {


  try {


    const body = await request.json();



    const {

      name,

      email,

      password,

      role,

      companyId,


    } = body;





    // Check existing email


    const existingUser = await prisma.user.findUnique({

      where:{

        email,

      },

    });





    if(existingUser){


      return NextResponse.json(

        {

          message:"Email already exists",

        },

        {

          status:400,

        }

      );


    }







    // Password Hash


    const hashedPassword = await bcrypt.hash(

      password,

      10

    );








    // Create User


    const user = await prisma.user.create({

      data:{


        name,


        email,


        password: hashedPassword,


        role,


        companyId,



      },


      include:{


        company:true,


      },


    });








    return NextResponse.json(

      {

        message:"User created successfully",

        user,


      },


      {

        status:201,

      }


    );







  }

  catch(error){



    console.error(error);





    return NextResponse.json(


      {

        message:"Failed to create user",

      },


      {

        status:500,

      }


    );



  }


}