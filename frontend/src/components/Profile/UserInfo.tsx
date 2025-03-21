import { useUserInfo } from "@/hooks/UserInfo";
import { Mail, User } from "lucide-react"

function UserInfo() {
    const { data } = useUserInfo();
    return (
        <div className="w-full space-y-4">
            <div className="space-y-1">
                <p className="flex"><User /> Name</p>
                <p className="w-full border border-white rounded-md py-2 px-3">{data.data.name}</p>
            </div>
            <div className="space-y-1">
                <p className="flex"><Mail /> Email</p>
                <p className="w-full border border-white rounded-md py-2 px-3">{data.data.email}</p>
            </div>
        </div>
    )
}

export default UserInfo
