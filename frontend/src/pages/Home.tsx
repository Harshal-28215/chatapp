import AppLayout from "@/Layout/AppLayout"
import { MessageSquareDot } from "lucide-react"

function Home() {
  return (
    <main className="h-full w-full flex justify-center items-center bg-[#020132] sm:relative absolute">
      <div className="flex justify-center items-center flex-col space-y-2.5">
        <MessageSquareDot size={50} className="animate-bounce"/>
        <h1 className="font-bold text-2xl">Welcome</h1>
        <p className="text-white/50">Select A Conversation From Sidebar To Chat</p>
      </div>
    </main>
  )
}

export default AppLayout(Home)
