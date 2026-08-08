// import { LucideIcon } from "lucide-react";

// interface StatCardProps {
// title: string;
// value: string | number;
// icon: LucideIcon;
// description?: string;
// }

// export default function StatCard({
// title,
// value,
// icon: Icon,
// description,
// }: StatCardProps) {
// return ( <div className="rounded-xl bg-white p-6 shadow-sm">

// ```
//   <div className="flex items-start justify-between">

//     <div>

//       <p className="text-sm font-medium text-slate-500">
//         {title}
//       </p>

//       <p className="mt-2 text-3xl font-bold text-slate-900">
//         {value}
//       </p>

//       {description && (
//         <p className="mt-1 text-xs text-slate-500">
//           {description}
//         </p>
//       )}

//     </div>

//     <div className="rounded-full bg-blue-50 p-3 text-blue-600">
//       <Icon size={25} />
//     </div>

//   </div>

// </div>

// );
// }

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <Icon size={25} />
        </div>
      </div>
    </div>
  );
}