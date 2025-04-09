import ChatForm from '@/components/Chat/ChatForm'
import ChatHeader from '@/components/Chat/ChatHeader'
import MessageBox from '@/components/Chat/MessageBox'
import { useUserInfo } from '@/hooks/UserInfo';
import AppLayout from '@/Layout/AppLayout'
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { useParams } from 'react-router';

function Chat() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState("")
    const [text, setText] = useState<string>("")


    const url = import.meta.env.VITE_API_URL;;
    const { data, isLoading } = useQuery({
        queryKey: ["chatHeaderUser", id],
        queryFn: async () => {
            const response = await fetch(`${url}chat/users/${id}`, {
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

    const { data: userData } = useUserInfo();


    return (
        <main className='bg-[#020132] w-full sm:relative absolute'>
            {isLoading ? <div className="h-[76px] flex justify-center items-center"><p>Loading...</p></div> : <ChatHeader data={data?.data} />}
            <MessageBox recieverImage={data?.data?.profilePic} senderImage={userData?.data?.profilePic} isMessageLoading={isMessageLoading} setIsUpdating={setIsUpdating} setText={setText} />
            <ChatForm setImageLoading={setIsMessageLoading} isUpdating={isUpdating} setIsUpdating={setIsUpdating} text={text} setText={setText} />
        </main>
    )
}

export default AppLayout(Chat)
