import { useMyContext } from "@/context/chatappContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function ChatHeader() {
    const params = useParams<{ id: string }>();
    const { onlineUsers } = useMyContext();
    const id = params.id;

    const { data, isLoading } = useQuery({
        queryKey: ["chatHeaderUser", id],
        queryFn: async () => {
            const response = await fetch(`/chat/users/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            return response.json();
        },
        staleTime: 60 * 60 * 1000,
        enabled: !!id,
    });

    if (isLoading) return <p>Loading...</p>

    return (
        <div>
            <div className="flex gap-3 p-3 bg-[#0d0c3b]">
                <div className="relative w-[50px] h-[50px]">
                    <img
                        src={data?.data?.profilePic || "/profile.jpg"}
                        alt="profile logo"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div>
                    <h3>{data?.data?.name || "Loading..."}</h3>
                    <p>{onlineUsers?.includes(data.data._id) ? "online" : "offline"}</p>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
