import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DashboardModuleCardProps {
title: string;
description: string;
icon: LucideIcon;
href: string;
}

export default function DashboardModuleCard({
title,
description,
icon: Icon,
href,
}: DashboardModuleCardProps) {
return ( <Link
   href={href}
   className="group rounded-xl bg-slate-50 p-5 transition hover:bg-blue-50 hover:shadow-sm"
 >

```
  <div className="flex items-start gap-4">

    <div className="rounded-lg bg-white p-3 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white">
      <Icon size={23} />
    </div>

    <div>
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>

  </div>

</Link>

);
}
