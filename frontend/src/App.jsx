import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RefreshContext } from "./context/RefreshContext";
import { UserProvider } from "./context/UserContext";
import { useState } from "react";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/UserProfile/UserProfile";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import LoadingPage from "./pages/LoadingPage/LoadingPage";

function App() {
  const [refresh, setRefresh] = useState(true);

  return (
    <>
        <BrowserRouter>
              <RefreshContext.Provider value={{ refresh, setRefresh }}>
                <UserProvider>
                  <Routes>
                    <Route path="/" element={<LoadingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<UserProfile />} />
                    {/* <Route path="/passwordReset" element={<ResetPassword />} /> */}
                  </Routes>
                </UserProvider>
              </RefreshContext.Provider>
        </BrowserRouter>
    </>
  );
}

export default App;