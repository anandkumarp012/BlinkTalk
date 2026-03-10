import React, { useContext } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SideBar = ({ selectedUser, setSelectedUser }) => {

  const {logout} = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Top Section */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src="/logo.png" alt="logo" className="max-w-10" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="w-6 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p onClick={()=> logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user.."
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex flex-col">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id
                ? "bg-[#282142]/50"
                : "hover:bg-[#282142]/30"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile"
              className="w-[35px] aspect-square rounded-full"
            />

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>

              {index < 2 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-gray-400 text-xs">Offline</span>
              )}
            </div>

            {index > 2 && (
              <p className="absolute top-3 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                2
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;