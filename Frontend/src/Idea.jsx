import React, { useEffect, useState } from "react";



const Idea = () => {
  const [user, setUser] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in first!");
      window.location.href = "/";
    } else {
      setUser("Welcome back, creative mind! 🧠");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user}</h1>
      <p className="text-lg">Share your brilliant idea about democracy here ✨</p>
    </div>
  );
};

export default Idea;
