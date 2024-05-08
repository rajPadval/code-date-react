import { useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setProgress, setUser } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setProgress(0);
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please fill all fields");
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Invalid email");
    }

    const res = await axios.post(
      "http://localhost:5000/api/login",
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    setUser(data.data);
    localStorage.setItem("token", data.token);

    setProgress(100);
    if (data.success === true) {
      toast.success(data.message);
      navigate("/profile");
      e.target.reset();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-32">
      <h2 className="font-bold text-3xl text-black dark:text-white">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="email" className="text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="password" className="text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex gap-8 justify-between items-center mt-5">
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded-md"
          >
            Login
          </button>
          <div>
            <Link to="/signup" className="text-primary text-sm">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
