import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET SINGLE COMPANY

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await context.params;


    const company = await prisma.company.findUnique({

      where:{
        id,
      },

    });



    if(!company){

      return NextResponse.json(
        {
          message:"Company not found",
        },
        {
          status:404,
        }
      );

    }



    return NextResponse.json({
      company,
    });



  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        message:"Failed to fetch company",
      },
      {
        status:500,
      }
    );

  }

}





// UPDATE COMPANY

export async function PUT(

  request:Request,

  context:{
    params:Promise<{id:string}>;
  }

){


  try{


    const {id}=await context.params;


    const body=await request.json();




    const company=await prisma.company.update({

      where:{
        id,
      },


      data:{

        ...(body.name !== undefined && {
          name:body.name,
        }),


        ...(body.logo !== undefined && {
          logo:body.logo,
        }),


        ...(body.phone !== undefined && {
          phone:body.phone,
        }),


        ...(body.email !== undefined && {
          email:body.email,
        }),


        ...(body.address !== undefined && {
          address:body.address,
        }),


        ...(body.status !== undefined && {
          status:body.status,
        }),


      },


    });



    return NextResponse.json({

      message:"Company updated successfully",

      company,

    });



  }

  catch(error){

    console.error(error);


    return NextResponse.json(
      {
        message:"Failed to update company",
      },
      {
        status:500,
      }
    );

  }


}





// DEACTIVATE COMPANY

export async function DELETE(

 request:Request,

 context:{
  params:Promise<{id:string}>;
 }

){


 try{


  const {id}=await context.params;



  const company=await prisma.company.update({

    where:{
      id,
    },


    data:{

      status:"INACTIVE",

    },


  });



  return NextResponse.json({

    message:"Company deactivated successfully",

    company,

  });



 }

 catch(error){

  console.error(error);


  return NextResponse.json(
    {
      message:"Failed to deactivate company",
    },
    {
      status:500,
    }
  );


 }


}