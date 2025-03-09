import { cookies } from "next/headers";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AdminSocketProvider } from "@/context/AdmnSocketContext";

export default function AdminLayout({ children }) {
  const authCookie = cookies().get("adminAuth"); // "auth" cookie ni olish
  const auth = authCookie ? JSON.parse(authCookie.value) : null;
  return (
    <AdminSocketProvider>
      <div className="flex flex-col min-h-screen">
        <Header authData={auth} />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-muted/40 overflow-y-auto ml-64 mt-16">
            {children}
          </main>
        </div>
      </div>
    </AdminSocketProvider>
  );
}
