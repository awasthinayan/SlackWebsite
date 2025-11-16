import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Idea = () => {
  const [user, setUser] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in first!");
      window.location.href = "/";
    } else {
      setUser("Welcome back, creative mind! 🧠");
    }
  }, []);

  const handleClick = () => {
    navigate("/LiquidEffect");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user}</h1>
      <p className="text-lg">Share your brilliant idea about democracy here ✨</p>

      <button
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        onClick={handleClick}
      >
        Move forward
      </button>
    </div>
  );
};

export default Idea;
