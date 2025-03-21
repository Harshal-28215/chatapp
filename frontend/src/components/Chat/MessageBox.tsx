import { messageType, useMyContext } from "@/context/chatappContext";
import { useEffect, useRef } from "react"
import { useParams } from "react-router";

function MessageBox() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const { socketexist, setMessages, messages } = useMyContext();
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    async function fetchMessages() {
        await fetch(`/chat/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }).then((res) => res.json()).then(data => setMessages(data.data))
    }

    function socketmessage() {
        socketexist?.on("newMessage", (data: messageType) => {
            if (data?.senderId !== id ) return; 
            setMessages(prevMessages => [...prevMessages, data])
        })
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        fetchMessages();
    }, [id])

    useEffect(() => {
        socketmessage();
        return () => {
            socketexist?.off("newMessage")
        }
    }, [socketexist])


    return (
        <div className='p-3 space-y-2 h-[calc(100vh-195px)] overflow-y-auto'>
            {
                messages?.map((message: messageType) => (
                    <div className={`flex items-start gap-3 ${message?.receiverId === id ? 'flex-row-reverse' : 'flex-row'}`} key={message?._id}>
                        <img src="/profile.png" alt="profile" width={30} height={30} className='object-cover rounded-full' />
                        <div className="bg-[#010018] p-2 rounded-md relative flex flex-col gap-2">
                            {
                                message?.image &&
                                <div className='rounded-md'>
                                    <img src={message?.image} alt="profile" className='object-cover rounded-md max-w-[100px] max-h-[200px]' />
                                </div>
                            }
                            <p>{message?.text}</p>
                        </div>
                    </div>
                ))
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageBox
