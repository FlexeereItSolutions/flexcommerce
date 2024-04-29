

import Navbar from '@/components/Navbar'
import SupportPage from '@/components/support/index'
export default function Home() {
  return (
    <>
    <div className="flex flex-col min-h-screen">
    <Navbar />
      <SupportPage/>

    </div>
    </>
  );
}