import { useUserInfo } from '@/hooks/UserInfo';
import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react'
import React, { useState } from 'react'

function ProfilePicture() {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<string>("")

    const { data } = useUserInfo();

    const { profilePic } = data.data;

    const submitPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files;
        if (!files) return;
        const file = files[0];
        if (!file) return

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result as string;
            setSelectedFile(base64Image)
            const formdata = new FormData();
            formdata.append("profilePic", file);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                method: "PUT",
                body: formdata,
                credentials: "include"
            })

            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ["userInfo"] });
            }
        }
    }

    return (
        <div className="w-[100px] h-[100px] rounded-full relative border-4 border-white">
            <img src={profilePic || selectedFile || `/profile.png`} alt="profile image" className="object-cover w-full h-full rounded-full" />
            <label htmlFor="image">
                <Camera className="absolute bg-gray-700 rounded-full p-1 bottom-0 right-0 border-black border cursor-pointer" />
            </label>
            <input type="file" name="image" id="image" className="hidden" onChange={submitPicture} />
        </div>
    )
}

export default ProfilePicture
