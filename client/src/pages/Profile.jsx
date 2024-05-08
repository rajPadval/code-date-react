import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoHeartSharp, IoClose } from "react-icons/io5";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const { user } = useContext(AppContext);

  const getUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/getUsers");
    const { data } = await res.data;
    // Filter out the current user's profile
    const filteredUsers = data.filter(
      (u) =>
        u._id !== user?._id &&
        !user?.disliked?.includes(u._id) &&
        !user?.favourites?.includes(u._id)
    );
    setUsers(filteredUsers);
    console.log(user);
  };

  const previousProfile = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  const nextProfile = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const addToFav = async (id) => {
    const res = await axios.put("http://localhost:5000/api/addToFav/" + id);
    const data = await res.data;
    if (data.success === true) {
      toast.success(data.message);
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };
  const addToDis = async (id) => {
    const res = await axios.put("http://localhost:5000/api/addToDis/" + id);
    const data = await res.data;
    if (data.success === true) {
      toast.success(data.message);
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, [user]);

  return (
    <>
      <div className="flex justify-center items-center my-10 sm:my-32">
        <div>
          <div className="rounded-lg shadow-primaryLight shadow-sm w-[75vw] h-[80vw] sm:w-[25vw] sm:h-[60vh] overflow-hidden relative">
            <img
              src={users[currentUserIndex]?.profile}
              alt={users[currentUserIndex]?.name}
              className="rounded-lg object-cover  w-full h-full transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            />
            <div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h1 className="text-white text-2xl font-semibold">
                  {users[currentUserIndex]?.name}
                </h1>
                <p className="text-white">{users[currentUserIndex]?.email}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-red-500 p-2 transition-all duration-300 ease-in-out cursor-pointer ">
                    <IoClose
                      onClick={() => addToDis(users[currentUserIndex]?._id)}
                      className="text-red-500  text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer hover:text-white"
                    />
                  </div>
                  <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-blue-500 p-2 transition-all duration-300 ease-in-out cursor-pointer ">
                    <IoHeartSharp
                      onClick={() => addToFav(users[currentUserIndex]?._id)}
                      className="text-blue-500  text-3xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-125 hover:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
