import { useEffect, useRef, useState } from 'react'
import Img1 from '../../assets/img1.jpg'
import profilep from '../../assets/profilep.jpg'
import Input from '../../components/Input'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080');

const Dashboard = () => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
	const [conversations, setConversations] = useState([])
	const [messages, setMessages] = useState({})
	const [message, setMessage] = useState('')
	const [users, setUsers] = useState([])
	const [socket, setSocket] = useState(null)
	const messageRef = useRef(null)

	useEffect(() => {
		setSocket(io('http://localhost:8080'))
	}, [])

	useEffect(() => {
		socket?.emit('addUser', user?.id);
		socket?.on('getUsers', users => {
			console.log('activeUsers :>> ', users);
		})
		socket?.on('getMessage', data => {
			setMessages(prev => ({
				...prev,
				messages: [...prev.messages, { user: data.user, message: data.message }]
			}))
		})}
		, [socket])

	useEffect(() => {
		messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages?.messages])

	useEffect(() => {
		const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
		const fetchConversations = async () => {
			const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const resData = await res.json()
			setConversations(resData)
		}
		fetchConversations()
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const resData = await res.json()
			setUsers(resData)
		}
		fetchUsers()
	}, [])

	const fetchMessages = async (conversationId, receiver) => {
		const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const resData = await res.json()
		setMessages({ messages: resData, receiver, conversationId })
	}

	const sendMessage = async (e) => {
		setMessage('')
		socket?.emit('sendMessage', {
			senderId: user?.id,
			receiverId: messages?.receiver?.receiverId,
			message,
			conversationId: messages?.conversationId
		});
		const res = await fetch(`http://localhost:8000/api/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				conversationId: messages?.conversationId,
				senderId: user?.id,
				message,
				receiverId: messages?.receiver?.receiverId
			})
		});
	}

	return (
		<div className='w-screen flex'>
  {/* Left Sidebar */}
  <div className='w-[25%] h-screen bg-gradient-to-b from-yellow-200 to-yellow-400 overflow-scroll shadow-lg'>
    {/* User Profile */}
	{/* User Profile */}
<div className='flex items-center justify-between p-4 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-lg shadow-md'>
  <div className='flex items-center'>
    <div className='relative'>
      <img src={profilep} width={75} height={75} className='border-2 border-yellow-500 p-2 rounded-full' alt='Profile' />
      <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
    </div>
    <div className='ml-4'>
      <h3 className='text-2xl font-semibold text-green-900'>{user?.fullName}</h3>
      <p className='text-lg font-light text-gray-700'>My Account</p>
    </div>
  </div>
  <div className='cursor-pointer text-xl text-green-900 hover:text-green-700'>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="9" />
      <line x1="3.6" y1="12" x2="20.4" y2="12" />
      <line x1="3.6" y1="12" x2="20.4" y2="12" />
      <path d="M11.5 3a17 17 0 0 1 0 18" />
      <path d="M12.5 3a17 17 0 0 0 0 18" />
    </svg>
  </div>
</div>

   
    
    {/* Divider */}
    <hr className="mx-6 my-2 border-b border-gray-300" />

    {/* Conversations */}
    <div className='mx-6 mt-4'>
      <div className='text-green-900 text-lg font-bold'>Messages</div>
      <div>
        {conversations.length > 0 ? (
          conversations.map(({ conversationId, user }) => (
            <div className='flex items-center py-4 border-b border-b-gray-300 cursor-pointer hover:bg-yellow-200' onClick={() => fetchMessages(conversationId, user)} key={conversationId}>
              <img src={Img1} className="w-[60px] h-[60px] rounded-full p-[2px] border border-yellow-500" alt='Profile' />
              <div className='ml-4'>
                <h3 className='text-lg font-semibold text-green-900'>{user?.fullName}</h3>
                <p className='text-sm font-light text-gray-600'>{user?.email}</p>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-lg font-semibold mt-4 text-green-900'>No Conversations</div>
        )}
      </div>
    </div>
  </div>
  
  {/* Middle Chat Area */}
  <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
    {messages?.receiver?.fullName && (
      <div className='w-[75%] bg-secondary h-[80px] my-4 rounded-full flex items-center px-4 py-2 shadow-md'>
        <img src={Img1} width={60} height={60} className="rounded-full" alt='Profile' />
        <div className='ml-4 mr-auto'>
          <h3 className='text-lg text-green-900 font-semibold'>{messages?.receiver?.fullName}</h3>
          <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
        </div>
        <div className='cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
            <line x1="15" y1="9" x2="20" y2="4" />
            <polyline points="16 4 20 4 20 8" />
          </svg>
        </div>
      </div>
    )}

    <div className='h-[75%] w-full overflow-scroll shadow-md'>
      <div className='p-4'>
        {messages?.messages?.length > 0 ? (
          messages.messages.map(({ message, user: { id } = {} }) => (
            <div className={`max-w-[40%] rounded-xl p-4 mb-4 ${id === user?.id ? 'bg-green-900 text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'}`} key={message}>
              {message}
            </div>
          ))
        ) : (
          <div className='text-center text-lg font-semibold mt-4 text-green-900'>No Messages or No Conversation Selected</div>
        )}
        <div ref={messageRef}></div>
      </div>
    </div>

    {messages?.receiver?.fullName && (
      <div className='p-4 w-full flex items-center'>
        <Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
        <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="10" y1="14" x2="21" y2="3" />
            <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        </div>
        <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="12" y1="9" x2="12" y2="15" />
          </svg>
        </div>
      </div>
      )}
  </div>
  
  {/* Right Sidebar */}
  <div className='w-[25%] h-screen bg-gradient-to-b from-yellow-200 to-yellow-400 overflow-scroll shadow-lg'>
    <div className='text-green-900 text-lg font-bold'>People</div>
    <div>
      {users.length > 0 ? (
        users.map(({ userId, user }) => (
          <div className='flex items-center py-4 border-b border-b-gray-300 cursor-pointer hover:bg-yellow-200' onClick={() => fetchMessages('new', user)} key={userId}>
            <img src={Img1} className="w-[60px] h-[60px] rounded-full p-[2px] border border-yellow-500" alt='Profile' />
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-green-900'>{user?.fullName}</h3>
              <p className='text-sm font-light text-gray-600'>{user?.email}</p>
            </div>
          </div>
        ))
      ) : (
        <div className='text-center text-lg font-semibold mt-4 text-green-900'>No Conversations</div>
      )}
    </div>
  </div>
</div>




	)
}

export default Dashboard