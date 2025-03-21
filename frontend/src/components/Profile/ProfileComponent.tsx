import ProfilePicture from "./ProfilePicture"
import UserInfo from "./UserInfo"

function ProfileComponent() {
    return (
        <div className="flex justify-center items-center flex-col space-y-3 w-[500px] bg-[#21212e] rounded-md p-5">
            <h1 className="font-bold text-3xl">Profile</h1>
            <p className="text-white/45">Your Profile Information</p>

            <ProfilePicture />
            <UserInfo />
            
        </div>
    )
}

export default ProfileComponent
