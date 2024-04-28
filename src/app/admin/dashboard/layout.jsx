import { Inter } from "next/font/google";
import AdminHeader from "../../../components/AdminHeader"

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
    return (
        <>
            <AdminHeader />
            {children}
        </>

    );
}