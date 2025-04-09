import { messageType } from '@/context/chatappContext'
import { Edit2, TrashIcon } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router'

type MessageCardProps = {
    message: messageType
    recieverImage: string
    senderImage: string
    id?: string
    setIsUpdating: (value: string) => void
    setText: React.Dispatch<React.SetStateAction<string>>
}

function MessageCard({ message, recieverImage, senderImage, id, setIsUpdating, setText }: MessageCardProps) {
console.log(recieverImage);

    const updateMessage = async () => {
        setIsUpdating(message._id)
        setText(message.text)
    }
    const deleteMessage = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}chat/deletemessage/${message._id}/${message.receiverId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to delete message");
    }

    return (
        <>
            <div className={`flex items-start gap-3 ${message?.receiverId === id ? 'flex-row-reverse' : 'flex-row'} group`} key={message?._id}>
                <div className="relative w-[30px] h-[30px]">
                    <img src={message?.receiverId === id && senderImage ? senderImage : recieverImage ? recieverImage : "/profile.png"} alt="profile" className='w-full h-full object-cover rounded-full' />
                </div>
                <div className="bg-[#010018] p-2 rounded-md relative flex flex-col gap-2">
                    {
                        message?.image &&
                        <Link to={message?.image} target="_blank" rel="noopener noreferrer" className='rounded-md'>
                            <img src={message?.coverImage} alt="profile" className='object-cover rounded-md max-w-[100px] max-h-[200px]' />
                        </Link>
                    }
                    <p>{message?.text}</p>
                </div>
                {message?.receiverId === id &&
                    <div className={`flex gap-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300`}>
                        <Edit2 size={15} onClick={updateMessage} />
                        <TrashIcon size={15} onClick={deleteMessage} />
                    </div>
                }
            </div>
        </>
    )
}

export default memo(MessageCard, (prevProps, nextProps) => {
    return prevProps.message._id === nextProps.message._id &&
        prevProps.message.text === nextProps.message.text
})
