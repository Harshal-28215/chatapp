import { SidebarUsers } from "@/utils/Types";
import { memo } from "react";
import { Link } from "react-router"


const Users = memo(({ data, onlineUsers }: { data: SidebarUsers, onlineUsers: string[] | undefined }) => {

    const isUserOnline = onlineUsers?.includes(data._id)

    return (
        <div className='flex gap-2.5' key={data._id}>
            <div className='relative w-[50px] h-[50px]'>
                <img src={data.profilePic || "/profile.jpg"} alt="profile pic" className='w-full h-full object-cover rounded-full' />
                {isUserOnline && <span className="absolute top-0 right-0 w-[10px] h-[10px] rounded-full bg-green-600"></span>}
            </div>
            <Link to={`/chat/${data._id}`} className='w-[calc(100%-60px)]'>
                <h3>{data.name}</h3>
                <p>{isUserOnline ? "online" : "offline"}</p>
            </Link>
        </div>
    )
})

export default Users
