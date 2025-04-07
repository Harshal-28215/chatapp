import Users from './Users'
import { useSidebarUsers } from '@/hooks/SidebarUsers';
import { SidebarUsers } from '@/utils/Types';
import { useMyContext } from '@/context/chatappContext';
import { UsersIcon } from 'lucide-react';
import { use, useCallback, useEffect, useRef, useState } from 'react';

function UserSideBar() {

  const { data, isLoading } = useSidebarUsers();
  const { onlineUsers, isOpen, setIsOpen, socketexist } = useMyContext();
  const [newUser, setNewUser] = useState<SidebarUsers[]>([])

  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth <= 640 // Only close on small screens
      ) {
        setIsOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);  

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 640) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  const newUserHandler = useCallback((data: SidebarUsers) => {
    setNewUser((prev: SidebarUsers[]) => [...prev, data]);
    console.log("newUser", data);
  }, [])

  useEffect(() => {
    if (!socketexist) return;

    socketexist?.on("newUser", newUserHandler)

    return () => {
      socketexist?.off("newUser", newUserHandler)
    }

  }, [socketexist, newUserHandler])

  return (
    <aside ref={sidebarRef} className='w-[300px] p-2 relative h-full bg-[#010025] z-10' style={{
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
    }}>

      <div>
        <h1 className='font-bold text-2xl flex items-center gap-1.5 mb-5 text-white/50'><UsersIcon /> Contects</h1>
      </div>
      {isLoading ?
        <p>Loading...</p>
        :
        <div className='space-y-5 sm:h-[calc(100vh-120px)] h-[calc(100vh-170px)] overflow-y-scroll'>
          <>
            {data.data.map((data: SidebarUsers) => (
              <Users data={data} onlineUsers={onlineUsers} setIsOpen={setIsOpen} key={data._id} />
            ))}
            {newUser.map((data: SidebarUsers) => (
              <Users data={data} onlineUsers={onlineUsers} setIsOpen={setIsOpen} key={data._id} />
            ))}
          </>
        </div>

      }
    </aside>
  )
}

export default UserSideBar
