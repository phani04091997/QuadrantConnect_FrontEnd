import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Resources from "./components/Resources";
import AddResource from "./components/AddResource";
import Status from "./components/Status";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("H1B"); // Default userType as H1B


  return (
    <Router>
      {isLoggedIn && <Navbar setUserType={setUserType} />}
      <Routes>
        {/* Login and SignUp Routes */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home userType={userType}/> : <Navigate to="/" />}
        />
        <Route
          path="/resources"
          element={isLoggedIn ? <Resources userType={userType} /> : <Navigate to="/" />}
        />
        <Route
          path="/add-resource"
          element={isLoggedIn ? <AddResource /> : <Navigate to="/" />}
        />
        <Route
          path="/status"
          element={isLoggedIn ? <Status userType={userType}/> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
