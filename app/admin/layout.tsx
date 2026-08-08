// import DashboardSidebar from "@/components/dashboard-sidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-slate-100">
//       {/* Admin Sidebar */}
//       <DashboardSidebar />

//       {/* Admin Content Area */}
//       <main className="min-w-0 flex-1">
//         {children}
//       </main>
//     </div>
//   );
// }


import DashboardSidebar from "@/components/dashboard-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Admin Sidebar */}
      <DashboardSidebar />

      {/* Admin Content Area */}
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}