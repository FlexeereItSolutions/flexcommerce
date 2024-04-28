// import { Hero, Navbar, Products } from "@/components";
import Footer from "@/components/Footer";
import { Navbar, Hero, Products } from "../components"

export default async function Home() {
  return (
    <main className=" w-screen ">
      <Navbar />
      <Hero />
      <Products />
      <Footer />
    </main>
  );
}
