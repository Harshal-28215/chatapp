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


function App() {
  const { data, error, isLoading } = useUserInfo();
  const { connectSocket } = useMyContext();

  if (error) {
    console.error(error)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const message = data?.message as string;

  const userId = data?.data?._id
  if (userId) {
    connectSocket(userId)
  }

  return (

    <BrowserRouter>
      <Navbar userId={userId}/>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />


        <Route path="/" element={
          <ProtectedRoutes message={message} navigate="/login">
            <Home />
          </ProtectedRoutes>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoutes message={message} navigate="/login">
            <Chat />
          </ProtectedRoutes>
        } />
        <Route path="/profile" element={
          <ProtectedRoutes message={message} navigate="/login">
            <Profile />
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
