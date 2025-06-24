function HomeLoading() {
    return (
        <div className="h-[100vh]">
            <div className="flex justify-between p-4 px-10 bg-[#21212e]">
                <div className='w-[30px] h-[30px] bg-[#1a1a23] rounded-full skeleton'>
                </div>
                <div className="flex gap-5 items-center">
                    <div className="w-[100px] h-[30px] rounded-full bg-[#1a1a23] skeleton"></div>
                    <div className="w-[100px] h-[30px] rounded-full bg-[#1a1a23] skeleton"></div>
                </div>
            </div>
            <div className="h-[calc(100vh-56px)] flex justify-center items-center">
                <div className='space-y-8 max-w-3xl mx-auto py-10 bg-[#1a1a23] p-3 rounded-md w-[500px] h-[350px] skeleton'></div>
            </div>
        </div>
    )
}

export default HomeLoading
