import React, { useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/authContextStore'

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)

  if (!selectedUser) return null

  const sharedImages = messages.filter((message) => message.image).map((message) => message.image)
  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <aside className='bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden border-l border-white/10'>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt='' className='w-20 aspect-square rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto text-center'>{selectedUser.bio || 'No bio added yet.'}</p>
      </div>

      <hr className='border-[#ffffff30] my-4' />

      <div className='px-5 pb-24 text-xs'>
        <p className='text-sm font-medium'>Media</p>

        {sharedImages.length > 0 ? (
          <div className='mt-3 max-h-72 overflow-y-scroll grid grid-cols-2 gap-4 opacity-90'>
            {sharedImages.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type='button'
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                className='cursor-pointer rounded-md overflow-hidden bg-white/5'
              >
                <img src={url} alt='shared media' className='h-24 w-full object-cover' />
              </button>
            ))}
          </div>
        ) : (
          <p className='mt-3 text-white/60'>No shared media yet.</p>
        )}
      </div>

      <button
        onClick={logout}
        className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'
      >
        Logout
      </button>
    </aside>
  )
}

export default RightSideBar