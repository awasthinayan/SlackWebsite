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



function App() {
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
  );
}

export default App;













































