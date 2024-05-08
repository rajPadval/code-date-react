import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useUpload } from "../hooks/useUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [image, setImage] = useState(null);
  const { setProgress } = useContext(AppContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      toast.error("Image size must be less than 1MB");
    }
    {
      setImage(file);
    }
  };

  const onUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(progress);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      if (!name || !email || !password || !image) {
        toast.error("Please fill all fields");
        return;
      }
      if (name.trim === "" || email.trim === "" || password.trim === "") {
        toast.error("Please fill all fields");
        return;
      }

      if (name.length < 3 || (!email.includes("@") && !email.includes("."))) {
        toast.error("Please enter valid data");
        return;
      }

      const { public_id, url } = await useUpload({ image, onUploadProgress });
      if (!public_id || !url) {
        toast.error("Error uploading image");
        return;
      } else {
        const res = await axios.post("https://code-date-react-api.vercel.app/api/signup", {
          name,
          email,
          password,
          profile: url,
          publicId: public_id,
        });
        const data = await res.data;
        if (data.success === true) {
          toast.success(data.message);
          e.target.reset();
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-20">
      <h2 className="font-bold text-xl sm:text-3xl text-black dark:text-white">
        Let's create your profile
      </h2>
      <form className="grid sm:grid-cols-2 gap-5 " onSubmit={handleSignup}>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="name" className="text-black dark:text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 sm:mt-5">
          <label htmlFor="email" className="text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="password" className="text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="profile" className="text-black dark:text-white">
            Profile
          </label>
          <input
            type="file"
            accept="image/*"
            name="profile"
            id="profile"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:text-white"
          />
        </div>
        <div className="flex gap-8 justify-between items-center ">
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded-md"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
