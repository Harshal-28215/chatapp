import { useMyContext } from "@/context/chatappContext";
import { VideoIcon } from "lucide-react";
import { Link, useParams } from "react-router";

type chatHeaerProps = {
    data: {
        _id: string;
        name: string;
        profilePic: string;
    };
}

function ChatHeader({data}: chatHeaerProps) {
    const { onlineUsers } = useMyContext();
    const params = useParams<{ id: string }>();
    const userId = params.id;

    return (
        <div className="h-[74px] flex items-center justify-between bg-[#0d0c3b] py-3 px-8">
            <div className="flex gap-3">
                <div className="relative w-[50px] h-[50px]">
                    <img
                        src={data?.profilePic || "/profile.jpg"}
                        alt="profile logo"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div>
                    <h3>{data?.name || "Loading..."}</h3>
                    <p>{onlineUsers?.includes(data._id) ? "online" : "offline"}</p>
                </div>
            </div>
            <div>
                <Link to={`/videocall?userId=${userId}`} className="cursor-pointer"><VideoIcon /></Link>
            </div>
        </div>
    );
}

export default ChatHeader;
