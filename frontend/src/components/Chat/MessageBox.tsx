import { messageType, useMyContext } from "@/context/chatappContext";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router";

function MessageBox() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const { socketexist, messages, setMessages } = useMyContext();

    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    function socketmessage() {
        socketexist?.on("newMessage", (data: messageType) => {
            if (data?.senderId !== id) return;
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
        const url = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : '/';
        async function fetchMessages() {
            setIsLoading(true)
            try {
                await fetch(`${url}chat/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }).then((res) => res.json()).then(data => setMessages(data.data))
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        setTimeout(() => {
            fetchMessages();
        }, 0);
        return () => {
            setMessages([]);
        };
    }, [id]);

    useEffect(() => {
        socketmessage();
    }, [socketexist, id])


    isLoading && <div className="h-[100vh] flex justify-center items-center"><p>Loading...</p></div>

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
