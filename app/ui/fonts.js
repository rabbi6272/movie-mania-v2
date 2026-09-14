import localFont from "next/font/local";

export const nunito = localFont({
  src: "../../public/fonts/Nunito.ttf",
  subsets: ["latin"],
  display: "swap",
});

export const ttTrailer = localFont({
  src: "../../public/fonts/tttrailer.ttf",
  display: "swap",
  style: "italic",
  weight: "800",
});
