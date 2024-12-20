import toast from "react-hot-toast";
import "./Header.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/reducers/user";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //@ts-ignore
  const { user } = useSelector((state) => state.user);
  const handleLogout = async () => {
    try {
      await axios.post("/user/logout");
      toast.success("Logged Out");
      dispatch(setUser(null));

      navigate("/auth");
    } catch (error) {
      console.log(error, "Hey");
      //@ts-ignore

      toast.error(error?.response?.data?.message);
    }
  };

  const handleBecomeASeller = async () => {
    const res = await axios.post("/stripe/createAccountLink");
    location.href = res.data.url;
    try {
    } catch (error) {}
  };
  return (
    <div className="Header">
      <div className="profile">
        <button>My Profile</button>
        <button>Statistics</button>
      </div>

      <div>
        {!user?.isActiveStripeAccount && (
          <button onClick={handleBecomeASeller}>Become a seller</button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
