import React, { useContext } from 'react'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import SideBar from '../components/SideBar'
import { ChatContext } from '../../context/ChatContext'

const Home = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div className='border w-full h-screen sm:px-[10%] sm:py-[5%]'>
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative 
        ${selectedUser 
          ? "md:grid-cols-[1fr_1.8fr_0.9fr]" 
          : "md:grid-cols-2"
        }`}
      >
        <SideBar />
        <ChatContainer />
        <RightSideBar />
      </div>
    </div>
  )
}

export default Home