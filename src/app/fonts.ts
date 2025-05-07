import { Open_Sans, Montserrat, Montserrat_Alternates } from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat-alternates",
  weight: "400",
});
