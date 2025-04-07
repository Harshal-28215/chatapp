import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ProtectedRoutes from "./protectedRoutes";
import { useUserInfo } from "./hooks/UserInfo";
import { useMyContext } from "./context/chatappContext";
import HomeLoading from "./components/Loading/HomeLoading";
import { useEffect } from "react";

function App() {
  const { data, error, isLoading } = useUserInfo();
  const { connectSocket,disconnectSocket } = useMyContext();

  if (error) {
    console.error(error);
  }
  
  useEffect(() => {
    if (data?.data?._id) {
      connectSocket(data?.data?._id);
    }

    return () => {
      disconnectSocket()
    }
  }, [data?.data?._id])

  if (isLoading) {
    return <HomeLoading />;
  }


  return (

    <BrowserRouter>
      <Navbar userId={data?.data?._id} />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />


        <Route path="/" element={
          <ProtectedRoutes message={data?.message} navigate="/login">
            <Home />
          </ProtectedRoutes>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoutes message={data?.message} navigate="/login">
            <Chat />
          </ProtectedRoutes>
        } />
        <Route path="/profile" element={
          <ProtectedRoutes message={data?.message} navigate="/login">
            <Profile />
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
