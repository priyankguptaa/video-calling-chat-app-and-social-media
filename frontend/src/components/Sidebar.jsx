import { useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js"

const Sidebar = () => {
    const {authUser} = useAuthUser();
    const location = useLocation();
    const currenPath = location.pathname;


  return (
    <div>
    </div>
  )
}

export default Sidebar
