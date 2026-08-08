"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import Link from "next/link";


interface Company {

  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: string;

}



export default function CompaniesPage() {


  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(true);





  async function loadCompanies() {


    try {


      const response = await fetch(
        "/api/admin/companies"
      );


      const data = await response.json();


      setCompanies(
        data.companies || []
      );


    }

    catch(error){

      console.error(error);

    }

    finally{

      setLoading(false);

    }


  }






  useEffect(()=>{

    loadCompanies();

  },[]);







  async function updateStatus(
    company: Company
  ){


    const newStatus =
      company.status === "ACTIVE"
      ? "INACTIVE"
      : "ACTIVE";



    const confirmAction = confirm(
      `Change company status to ${newStatus}?`
    );


    if(!confirmAction)
      return;




    const response = await fetch(

      `/api/admin/companies/${company.id}`,

      {

        method:"PUT",

        headers:{

          "Content-Type":"application/json",

        },


        body:JSON.stringify({

          status:newStatus,

        }),


      }

    );




    if(response.ok){

      loadCompanies();

    }


  }








  async function deleteCompany(
    id:string
  ){


    const confirmDelete = confirm(
      "Are you sure you want to delete this company?"
    );


    if(!confirmDelete)
      return;




    const response = await fetch(

      `/api/admin/companies/${id}`,

      {

        method:"DELETE",

      }

    );



    if(response.ok){

      loadCompanies();

    }


  }








  return (

    <div className="p-6">


      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">


        <div>


          <h1 className="
            text-3xl
            font-bold
            flex
            items-center
            gap-2
          ">

            <Building2/>

            Companies Management

          </h1>


          <p className="text-slate-500">

            Manage transport companies

          </p>


        </div>





        <Link

          href="/admin/companies/add"

          className="
            flex
            items-center
            gap-2
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "

        >

          <Plus size={18}/>

          Add Company

        </Link>



      </div>







      <div className="
        bg-white
        rounded-xl
        shadow
        overflow-hidden
      ">



      {loading ? (

        <p className="p-6">
          Loading...
        </p>


      ) : companies.length === 0 ? (


        <p className="p-6">
          No companies found
        </p>


      ) : (



        <table className="w-full">


          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>


              <th className="p-4 text-left">
                Phone
              </th>


              <th className="p-4 text-left">
                Email
              </th>


              <th className="p-4 text-left">
                Status
              </th>


              <th className="p-4 text-left">
                Actions
              </th>


            </tr>


          </thead>





          <tbody>


          {companies.map((company)=>(


            <tr
              key={company.id}
              className="border-t"
            >



              <td className="p-4 font-semibold">

                {company.name}

              </td>



              <td className="p-4">

                {company.phone || "-"}

              </td>



              <td className="p-4">

                {company.email || "-"}

              </td>





              <td className="p-4">


                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ${
                      company.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }
                  `}
                >

                  {company.status}

                </span>


              </td>






              <td className="
                p-4
                flex
                gap-4
              ">



                <Link

                  href={`/admin/companies/${company.id}/edit`}

                  className="
                    flex
                    items-center
                    gap-1
                    text-blue-600
                  "

                >

                  <Pencil size={16}/>

                  Edit

                </Link>






                <button

                  onClick={()=>updateStatus(company)}

                  className="
                    flex
                    items-center
                    gap-1
                    text-yellow-600
                  "

                >

                  <Power size={16}/>

                  {company.status === "ACTIVE"
                    ? "Disable"
                    : "Enable"
                  }

                </button>






                <button

                  onClick={()=>deleteCompany(company.id)}

                  className="
                    flex
                    items-center
                    gap-1
                    text-red-600
                  "

                >

                  <Trash2 size={16}/>

                  Delete

                </button>



              </td>



            </tr>


          ))}



          </tbody>



        </table>



      )}



      </div>



    </div>


  );

}