import { Poppins } from "next/font/google";
import "./globals.css";
 
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});
 
export const metadata = {
  title: "HostelHub",
  description: "A student hostel in New Baneshwor, Kathmandu",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">{children}</body>
    </html>
  );
}
 