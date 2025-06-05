import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";

export default function Layout() {
    const { uid } = useSelector((state) => state.auth);
    return (
        <div>
            {uid && <Navbar />}
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
}
