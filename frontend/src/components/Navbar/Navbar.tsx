import { useMyContext } from "@/context/chatappContext";
import { LogOut, MessageSquareDot, User } from "lucide-react"
import { Link } from "react-router"

function Navbar() {

    const { disconnectSocket } = useMyContext();

    function handlelogout(){
        console.log('logout');
        
        fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            console.log(res);
            
            if (res.ok) {
                disconnectSocket();
                window.location.href = "/login";
            }
        }
        )
    }

    return (
        <header>
            <nav className="flex justify-between p-4 px-10">
                <div>
                    <Link to="/"><MessageSquareDot /></Link>
                </div>
                <div className="flex gap-5 items-center">
                    <Link to="/profile" className="flex gap-1 justify-center items-center"><User size={20} /> Profile</Link>
                    <button className="flex gap-1 justify-center items-center cursor-pointer" onClick={handlelogout}><LogOut size={20} /> LoguOut</button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
