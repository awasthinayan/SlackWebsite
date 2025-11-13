import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Idea from "./idea";
import ForgotPasswordWithOtp from "./forgetPassword";
import LandingPage from "./LandingPage";
// import { useEffect, useState } from "react";
// import Button from "./Button";

function App() {

  // const [value, setvalue] = useState(0);

  // const [color, setColor] = useState("white");

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomColor =
  //       "#" + Math.floor(Math.random() * 16777215).toString(16);
  //     setColor(randomColor);
  //     console.log(randomColor);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  // const changeColor = () => {
  //   const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  //   setColor(randomColor);
  //   console.log(randomColor);
  // };

  return (
    <div className="text-white min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Routes>
        {/* Default route → Register page */}
        <Route path="/" element={<Navigate to="/LandingPage" />} />

        {/* Landing Page */}
        <Route path="/LandingPage" element={<LandingPage />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login  />}
        />

        {/* Welcome Page */}
        <Route
          path="/idea"
          element={<Idea />}
        />
        <Route
          path="/forgetPassword"
          element={<ForgotPasswordWithOtp/>}
        />
        
      </Routes>
    </div>
    // <div
    //   style={{
    //     backgroundColor: color,
    //     minHeight: "100vh",
    //     alignItems: "center",
    //     transition: "background-color 0.7s ease",
    //   }}
    // >
    //   <Button onClick={() => setvalue(value + 1)}>Click Me</Button>
    //   <p className="text-black">Button clicked {value} times</p>

    //   <button onClick={changeColor}>Click to change color</button>
    //   <h1 className="text-3xl font-bold ">Color is chnging automatically</h1>
    //   <p className="text-black">Color is {color}</p>
    // </div>
  );
}

export default App;
