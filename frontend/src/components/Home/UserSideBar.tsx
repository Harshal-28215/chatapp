import { Users as UsersIcon } from 'lucide-react'
import Users from './Users'
import { useSidebarUsers } from '@/hooks/SidebarUsers';
import { SidebarUsers } from '@/utils/Types';
import { useMyContext } from '@/context/chatappContext';


function UserSideBar() {


  const { data, isLoading } = useSidebarUsers();
  const {onlineUsers} = useMyContext();  

  return (
    <aside className='w-[300px] p-2 relative h-full bg-[#010025]'>
      <div>
        <h1 className='font-bold text-2xl flex items-center gap-1.5 mb-5'><UsersIcon /> Contects</h1>
      </div>
      {isLoading ?
        <p>Loading...</p>
        :
        <div className='space-y-5 h-[calc(100vh-120px)] overflow-y-scroll'>
          {data.data.map((data:SidebarUsers) => (
            <Users data={data} onlineUsers={onlineUsers}  key={data._id}/>
          ))}
        </div>

      }
    </aside>
  )
}

export default UserSideBar
