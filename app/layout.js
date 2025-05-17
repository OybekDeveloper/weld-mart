import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import Sidebar from "@/components/shared/sidebar";
import { cookies } from "next/headers";
import Footer from "@/components/shared/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { getData } from "@/actions/get";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "WeldMart",
  description: "WeldMart – качественное сварочное оборудование и материалы. Широкий ассортимент, доступные цены, быстрая доставка. Всё для профессионалов и любителей!",
};

export default async function RootLayout({ children }) {
  const [brands, categories] = await Promise.all([
    getData("/api/brands", "brand"),
    getData("/api/categories", "category"),
  ]);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" sizes="48" />
      </head>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <main>
            <Header categoriesData={categories} brandsData={brands} />
            {children}
            <Footer />
          </main>
        </AuthProvider>
        <Toaster
          closeButton
          richColors
          position="bottom-right"
          toastOptions={{
            classNames: {
              error: "bg-red-500 text-white",
              success: "bg-white text-primary",
              warning: "bg-yellow-400 text-white",
              info: "bg-blue-400",
            },
          }}
        />
      </body>
    </html>
  );
}
