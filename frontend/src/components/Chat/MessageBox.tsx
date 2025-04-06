import { messageType, useMyContext } from "@/context/chatappContext";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router";

function MessageBox({ recieverImage, senderImage }: { recieverImage: string, senderImage: string }) {

    console.log(recieverImage);


    const params = useParams<{ id: string }>();
    const id = params.id;
    const { messages, setMessages } = useMyContext();

    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        const url = import.meta.env.VITE_API_URL;
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


    isLoading && <div className="h-[100vh] relative flex justify-center items-center"><p>Loading...</p></div>

    return (
        <div className='p-3 space-y-2 h-[calc(100vh-196px)] overflow-y-auto'>
            {isLoading
                ?
                <div className="h-[full] flex justify-center items-center"><p>Loading...</p></div>
                :
                messages?.map((message: messageType) => (
                    <div className={`flex items-start gap-3 ${message?.receiverId === id ? 'flex-row-reverse' : 'flex-row'}`} key={message?._id}>
                        <div className="relative w-[30px] h-[30px]">
                            <img src={message?.receiverId === id && senderImage ? senderImage : recieverImage ? recieverImage : "/profile.png"} alt="profile" className='w-full h-full object-cover rounded-full' />
                        </div>
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
