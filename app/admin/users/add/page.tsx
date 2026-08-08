"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";


interface Company {

  id: string;
  name: string;

}



export default function AddUserPage() {


  const router = useRouter();


  const [companies, setCompanies] = useState<Company[]>([]);


  const [showPassword, setShowPassword] = useState(false);



  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",
    role: "COMPANY_ADMIN",
    companyId: "",

  });






  useEffect(()=>{

    loadCompanies();

  },[]);






  async function loadCompanies(){


    try{


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


  }






  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ){


    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });


  }







  async function handleSubmit(
    e: React.FormEvent
  ){


    e.preventDefault();



    const response = await fetch(

      "/api/admin/users",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json",

        },


        body:JSON.stringify(form),


      }

    );





    if(response.ok){


      router.push("/admin/users");


    }
    else{


      alert("Failed to create user");


    }


  }








  return (

    <div className="p-6">


      <div
        className="
          max-w-xl
          bg-white
          rounded-xl
          shadow
          p-6
        "
      >



        <h1
          className="
            text-2xl
            font-bold
            flex
            items-center
            gap-2
            mb-6
          "
        >

          <UserPlus/>

          Create Company Admin


        </h1>







        <form

          onSubmit={handleSubmit}

          className="space-y-4"

        >





          <input

            name="name"

            placeholder="Full Name"

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              p-3
            "

            required

          />







          <input

            name="email"

            placeholder="Email"

            type="email"

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              p-3
            "

            required

          />







          {/* Password with Show Hide */}


          <div className="relative">


            <input

              name="password"

              placeholder="Password"

              type={
                showPassword
                ? "text"
                : "password"
              }

              onChange={handleChange}

              className="
                w-full
                border
                rounded-lg
                p-3
                pr-12
              "

              required

            />



            <button

              type="button"

              onClick={()=>setShowPassword(!showPassword)}

              className="
                absolute
                right-3
                top-3
                text-slate-500
              "

            >


              {showPassword ? (

                <EyeOff size={20}/>

              ) : (

                <Eye size={20}/>

              )}


            </button>



          </div>









          <select

            name="companyId"

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              p-3
            "

            required

          >


            <option value="">

              Select Company

            </option>




            {companies.map((company)=>(


              <option

                key={company.id}

                value={company.id}

              >

                {company.name}


              </option>


            ))}



          </select>







          <button

            className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-lg
            "

          >

            Create User


          </button>





        </form>




      </div>



    </div>


  );

}