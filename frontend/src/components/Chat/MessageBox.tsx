import { useEffect, useRef } from "react"
import { useParams } from "react-router";
import MessageCard from "./MessageCard";
import { useMessages } from "@/hooks/Messages";

type MessageBoxProps = {
    recieverImage: string
    senderImage: string
    isMessageLoading: boolean
    setIsUpdating: (value: string) => void
    setText: React.Dispatch<React.SetStateAction<string>>
}

function MessageBox({ recieverImage, senderImage, isMessageLoading, setIsUpdating, setText }: MessageBoxProps) {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { messageIds, messageRef, isLoading } = useMessages(id)

    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messageIds]);

    return (
        <div className='p-3 space-y-2 h-[calc(100vh-196px)] overflow-y-auto'>
            {isLoading
                ?
                <div className="h-[full] flex justify-center items-center"><p>Loading...</p></div>
                :
                <>
                    {messageIds?.map((ids) => {
                        const message = messageRef.current.get(ids)
                        if (!message) return null
                        return <MessageCard key={ids} message={message} recieverImage={recieverImage} senderImage={senderImage} id={id} setIsUpdating={setIsUpdating} setText={setText} />
                    })}
                </>
            }
            {isMessageLoading &&
                <div className="flex items-start gap-3 flex-row-reverse">
                    <p>sending...</p>
                </div>
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageBox
