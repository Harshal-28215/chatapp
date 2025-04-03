import { useMyContext } from "@/context/chatappContext";
import { LogOut, MessageSquareDot, SidebarClose, SidebarOpen, User } from "lucide-react"
import { Link } from "react-router"

function Navbar({ userId }: { userId: string | undefined }) {

    const { disconnectSocket, isOpen, setIsOpen } = useMyContext();

    function handlelogout() {
        console.log('logout');

        const url = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : '/';


        fetch(`${url}auth/logout`, {
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
            <nav className="flex justify-between p-4 px-8">
                <div className="flex gap-6">
                    <div className='sm:hidden block' onClick={() => setIsOpen(!isOpen)}> {isOpen ? <SidebarClose /> : <SidebarOpen />}</div>
                    <div>
                        <Link to="/"><MessageSquareDot /></Link>
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <Link to="/profile" className="flex gap-1 justify-center items-center"><User size={20} /> Profile</Link>
                    {userId && <button className="flex gap-1 justify-center items-center cursor-pointer" onClick={handlelogout}><LogOut size={20} /> LoguOut</button>}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
