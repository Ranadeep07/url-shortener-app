import Image from "next/image";
import { Poppins } from "next/font/google";
import UrlShortener from "./components/UrlShortener";

const poppins = Poppins({ subsets: ["latin"], weight:['400'] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${poppins.className}`}
    >
      <UrlShortener />
    </main>
  );
}
