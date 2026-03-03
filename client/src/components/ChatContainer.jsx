import React, { useRef, useEffect } from "react";
import assets, { messagesDummyData } from "../assets/assets";
// import { formateMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef(null);

  // Auto scroll when messages change
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData]);

  return selectedUser ? (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-[40px] aspect-square rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5 cursor-pointer"
        />
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-1 overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.senderId === "680f50e4f10f3cd28382ef9"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="sent"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${
                  msg.senderId === "680f50e4f10f3cd28382ef9"
                    ? "bg-violet-500/30 rounded-br-none"
                    : "bg-white/10 rounded-bl-none"
                } text-white`}
              >
                {msg.text}
              </p>
            )}

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === "680f50e4f10f3cd28382ef9"
                    ? assets.avatar_icon
                    : selectedUser?.profilePic || assets.profile_martin
                }
                alt="avatar"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {msg.createdAt}
              </p>
            </div>
          </div>
        ))}

        {/* Auto Scroll Target */}
        <div ref={scrollEnd}></div>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400 bg-white/10 max-md:hidden">
      <img src="/logo.png" className="max-w-16" alt="logo" />
      <p className="text-lg font-medium text-white">
        Welcome to BlinkTalk
      </p>
    </div>
  );
};

export default ChatContainer;