import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:5000");

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on("welcome", (data) => console.log(data));

    return () => {
      socket.off("welcome");
    };
  }, [socket]);

  const hello = async () => {
    const response = await axios.post(
      "https://code-date-react-api.vercel.app/api/hello"
    );
    const data = await response.data;
    console.log(data);
  };

  return (
    <>
      <button onClick={hello}>Get Cookies</button>
    </>
  );
}

export default App;
