import { ImageUp, Send, X } from 'lucide-react';
import React, { useState } from 'react'
import { useParams } from 'react-router';

type messagepropstype = {
    setImageLoading: React.Dispatch<React.SetStateAction<boolean>>
    isUpdating: string
    setIsUpdating: (value: string) => void
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
}


function ChatForm({ setImageLoading, isUpdating, setIsUpdating, text, setText }: messagepropstype) {

    const [selectedFile, setSelectedFile] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const [isSending, setIsSending] = useState(false)

    const params = useParams();
    const id = params.id;

    let files: FileList | null;

    const submitPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        files = e.target?.files;
        if (!files) return;
        const file = files[0];
        if (!file) return
        setFile(file)
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const base64Image = reader.result as string;
            setSelectedFile(base64Image)
        }
    }

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    const handleformSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!text.trim() && !file) return;
        if (isSending) return;

        const formdata = new FormData();
        formdata.append("text", text);

        if (file) formdata.append("image", file);
        const url = import.meta.env.VITE_API_URL;

        if (isUpdating) {
            try {
                setIsSending(true)
                const response = await fetch(`${url}chat/updatemessage/${isUpdating}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                    credentials: "include",
                })
                // const data = await response.json();
                if (response.ok) {
                    setText("")
                    setSelectedFile("")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsUpdating("")
                setText("")
                setFile(null)
                setSelectedFile("")
                setIsSending(false)
            }
        } else {

            try {
                setImageLoading(true)
                setIsSending(true)
                const response = await fetch(`${url}chat/sendmessage/${id}`, {
                    method: "POST",
                    credentials: "include",
                    body: formdata
                })
                // const data = await response.json();
                if (response.ok) {
                    setText("")
                    setSelectedFile("")
                    setFile(null)
                }
            } catch (error) {
                console.log('error')
            } finally {
                setImageLoading(false)
                setIsSending(false)
            }
        }
    }

    const handleclearstate = () => {
        setSelectedFile("")
        setText("")
        setFile(null)
        setIsUpdating("")
        setImageLoading(false)
    }

    return (
        <form className='flex gap-3 p-3 justify-center items-center absolute sm:bottom-0 w-full' onSubmit={handleformSubmit}>
            {
                selectedFile &&
                <div className='absolute bottom-[65px] left-[10px] rounded-md'>
                    <X className='border-2 border-white/50 rounded-full bg-[#010018] absolute right-[-10px] top-[-10px] cursor-pointer' onClick={() => setSelectedFile("")} />
                    <img src={selectedFile} alt="profile" className='object-cover rounded-md max-w-[100px] max-h-[200px]' />
                </div>
            }
            <input type="text" id='message' placeholder='Enter Text' className='w-full p-2 border border-white/20 focus:border-white/50 outline-none rounded-md' value={text} onChange={handlechange} />
            {!isUpdating ?
                <>
                    <label htmlFor="image" className='cursor-pointer'><ImageUp /></label>
                    <input type="file" id='image' className='hidden' onChange={submitPicture} />
                </>
                :
                <X onClick={handleclearstate} className='cursor-pointer' />
            }
            <button type='submit' className='cursor-pointer' disabled={isSending}><Send className={isSending ? 'opacity-70' : 'opacity-100'} /></button>
        </form>
    )
}

export default ChatForm
