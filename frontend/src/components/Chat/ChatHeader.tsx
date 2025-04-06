import { useMyContext } from "@/context/chatappContext";

type chatHeaerProps = {
    data: {
        _id: string;
        name: string;
        profilePic: string;
    };
}

function ChatHeader({data}: chatHeaerProps) {
    const { onlineUsers } = useMyContext();

    return (
        <div>
            <div className="flex gap-3 p-3 bg-[#0d0c3b]">
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
        </div>
    );
}

export default ChatHeader;
