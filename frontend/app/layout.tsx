import { Poppins } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from '@/provider/QueryClientProvider';
 
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});
 
export const metadata = {
  title: "HostelHub",
  description: "A student hostel in New Baneshwor, Kathmandu",
};
 
export default function RootLayout({ children }: { children: React.ReactNode })
{
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">
    <ReactQueryClientProvider>
   {children}
     </ReactQueryClientProvider>
      </body>
    </html>
  );
}
 