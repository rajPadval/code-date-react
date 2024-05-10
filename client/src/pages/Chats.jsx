"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const socket = io("https://code-date-api.onrender.com");

const Chats = () => {
  

  const { user } = useContext(AppContext);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const getFromFav = async () => {
      try {
        const res = await axios.get(
          "https://code-date-api.onrender.com/api/getFromFav",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { data } = await res.data;
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    getFromFav();
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to:", socket.id);
    };

    const onDisconnect = () => {
      console.log("Disconnected from:", socket.id);
    };

    const onReceiveMessage = (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, senderEmail: message.senderEmail || user.email },
      ]);
    };

    const onRecipientOffline = (recipientEmail) =>
      toast.error(`${recipientEmail} is offline.`);

    // Attach event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);
    socket.on("recipient-offline", onRecipientOffline);

    return () => {
      // Detach event listeners on component unmount
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
      socket.off("recipient-offline", onRecipientOffline);
    };
  }, [socket, user.email]);

  const handleSendMessage = () => {
    socket.emit("send-message", {
      senderEmail: user.email,
      recipientEmail: recipientEmail,
      message: inputMessage,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderEmail: user.email, message: inputMessage },
    ]);
    setInputMessage("");
  };

  const initiateChat = (email) => {
    setRecipientEmail(email);
    toast.success(`Chatting with ${email}`);
    console.log("Chat initiated with:", email);
    socket.emit("initiate-chat", {
      senderEmail: user.email,
      recipientEmail: email,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-evenly items-center">
      <div className="w-screen overflow-x-scroll sm:overflow-x-hidden sm:w-[20vw] my-6 p-3">
        <h1 className="text-3xl font-bold mb-4 text-white">Chats</h1>
        <div className="flex  sm:flex-wrap gap-4 overflow-x-scroll sm:overflow-x-hidden">
          {friends?.map((friend) => (
            <div
              key={friend?._id}
              className={`bg-white p-4 rounded-lg ${
                recipientEmail === friend?.email &&
                "shadow-primary shadow-inner"
              }`}
              onClick={() => initiateChat(friend.email)}
            >
              <img
                src={friend?.profile}
                alt={friend?.name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <p className="text-center font-bold mt-2 font-ropaSans">
                {friend?.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[90vw] sm:w-[60vw] h-[80vh] shadow-primary shadow-inner my-6 rounded-lg relative">
        <h1 className="text-xl font-bold p-4 text-white bg-primary rounded-tl-md rounded-tr-md font-ropaSans">
          {" "}
          {recipientEmail}
        </h1>
        <div className="h-[80%] overflow-y-scroll p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderEmail === user.email
                  ? "justify-end"
                  : "justify-start"
              } mb-4`}
            >
              <div
                className={`bg-${
                  message.senderEmail === user.email ? "primary" : "white"
                } text-${
                  message.senderEmail === user.email ? "white" : "black"
                } p-2 w-fit rounded-lg ${
                  message.senderEmail === user.email
                    ? "rounded-tr-none ml-auto"
                    : "rounded-tl-none"
                }`}
              >
                <span>{message.senderEmail}</span>
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 items-center">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Enter your message here.."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="py-2 px-4 w-[90%] rounded-md outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-white px-5 py-2 rounded-md font-ropaSans"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
