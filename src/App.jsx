import { useEffect, useState } from 'react'
import './App.css'
import { TextInput } from './components/TextInput'
import { Message } from './components/Message';

function App() {
  const [messageList, setMessageList] = useState([
    {
      role: "assistant",
      content: "스무고개 게임을 시작할게요, 제가 생각하는 단어를 맞춰주세요!"
    }
  ])

  const addMessage = (message) => {
    setMessageList([...messageList, { role: "user", content: message }])
  }
  
  return (
    <div className='w-screen h-screen flex justify-center'>
      <div className='max-w-[500px] h-full w-full flex flex-col justify-center items-center bg-slate-200 py-10 px-5 gap-4'>
        <div className='w-full h-full bg-white rounded-xl p-10 flex flex-col gap-2'>
          {messageList.map((message, index) => {
            const isBot = message.role === 'assistant'
            return (
              <Message key={index} isBot={isBot} message={message} />
            )
          })}
        </div>
        <TextInput onSubmit={addMessage} />
      </div>
    </div>
  )
}

export default App
