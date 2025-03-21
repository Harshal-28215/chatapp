import ChatForm from '@/components/Chat/ChatForm'
import ChatHeader from '@/components/Chat/ChatHeader'
import MessageBox from '@/components/Chat/MessageBox'
import AppLayout from '@/Layout/AppLayout'

function Chat() {

    return (
        <main className='bg-[#020132] w-full relative'>
            <ChatHeader />
            <MessageBox />
            <ChatForm />
        </main>
    )
}

export default AppLayout(Chat)
