import { useMyContext } from '@/context/chatappContext';
import { ImageUp, Send, X } from 'lucide-react';
import React, { useState } from 'react'
import { useParams } from 'react-router';

function ChatForm() {
    const [selectedFile, setSelectedFile] = useState<string>("")
    const [text, setText] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const {setMessages} = useMyContext();

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

        const formdata = new FormData();    
        formdata.append("text", text);
        
        if (file) formdata.append("image", file);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/sendmessage/${id}`, {
            method: "POST",
            credentials: "include",
            body: formdata
        })
        const data = await response.json();
        if (response.ok) {
            setText("")
            setSelectedFile("")
            setMessages(prevmessage => [...prevmessage, data.data])
        }else{
            console.log('error')
        }
    }

    return (
        <form className='flex gap-3 p-3 justify-center items-center absolute bottom-0 w-full' onSubmit={handleformSubmit}>
            {
                selectedFile &&
                <div className='absolute bottom-[65px] left-[10px] rounded-md'>
                    <X className='border-2 border-white/50 rounded-full bg-[#010018] absolute right-[-10px] top-[-10px] cursor-pointer' onClick={() => setSelectedFile("")} />
                    <img src={selectedFile} alt="profile" className='object-cover rounded-md max-w-[100px] max-h-[200px]' />
                </div>
            }
            <input type="text" id='message' placeholder='Enter Text' className='w-full p-2 border border-white/20 focus:border-white/50 outline-none rounded-md' value={text} onChange={handlechange} />

            <label htmlFor="image" className='cursor-pointer'><ImageUp /></label>
            <input type="file" id='image' className='hidden' onChange={submitPicture} />

            <button type='submit' className='cursor-pointer'><Send /></button>
        </form>
    )
}

export default ChatForm
