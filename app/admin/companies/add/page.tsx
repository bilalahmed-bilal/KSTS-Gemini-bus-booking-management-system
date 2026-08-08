"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";


export default function AddCompanyPage() {


  const router = useRouter();


  const [form, setForm] = useState({

    name: "",
    phone: "",
    email: "",
    address: "",
    logo: "",

  });



  const [loading, setLoading] = useState(false);



  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }




  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setLoading(true);



    try {


      const response = await fetch(
        "/api/admin/companies",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },


          body: JSON.stringify(form),

        }

      );



      const data = await response.json();



      if(response.ok){

        router.push("/admin/companies");

      }
      else{

        alert(data.message);

      }



    }
    catch(error){

      console.error(error);

      alert("Something went wrong");

    }
    finally{

      setLoading(false);

    }


  }





  return (

    <div className="p-6">


      <div className="
        max-w-2xl
        bg-white
        rounded-xl
        shadow-sm
        p-6
      ">


        <h1 className="
          text-2xl
          font-bold
          flex
          items-center
          gap-2
          mb-6
        ">

          <Building2 />

          Add New Company

        </h1>




        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >



          <input

            name="name"

            placeholder="Company Name"

            value={form.name}

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

            required

          />




          <input

            name="phone"

            placeholder="Phone Number"

            value={form.phone}

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />




          <input

            name="email"

            placeholder="Email"

            value={form.email}

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />




          <input

            name="address"

            placeholder="Address"

            value={form.address}

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />




          <input

            name="logo"

            placeholder="Logo URL (optional)"

            value={form.logo}

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />





          <button

            disabled={loading}

            className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-lg
              hover:bg-blue-700
            "

          >

            {loading ? "Saving..." : "Save Company"}

          </button>



        </form>



      </div>



    </div>

  );

}