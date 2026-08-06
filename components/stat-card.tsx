import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}



export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {

  return (

    <Card className="rounded-xl shadow-sm">

      <CardContent className="p-6">

        <div className="
          flex
          items-center
          justify-between
        ">


          <div>

            <p className="
              text-sm
              text-slate-500
            ">
              {title}
            </p>


            <h2 className="
              text-3xl
              font-bold
              mt-2
            ">
              {value}
            </h2>

          </div>



          <div className="
            rounded-full
            bg-slate-100
            p-3
          ">

            <Icon size={28}/>

          </div>


        </div>


      </CardContent>


    </Card>

  );

}