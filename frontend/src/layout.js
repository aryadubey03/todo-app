import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

function Layout(){
    return(
        <>
        <Sidebar/>
        <div>
            <Outlet />
        </div>
        </>
    );
}

export default Layout;