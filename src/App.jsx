import { useEffect, useState } from 'react'
import './App.css'
import { TextInput } from './components/TextInput'
import OpenAI from "openai";
import { Message } from './components/Message';

const systemPrompt = `
당신은 스무고개 게임의 진행자입니다. 아래의 진행 예시를 참고해서 게임을 진행합니다. 게임을 진행하면서 정답 단어를 밝히지 않도록 주의합니다.

진행 예시: """
질문: (예 또는 아니요로 대답이 가능한 질문)
답변: (예 또는 아니요), (유저가 물어본 질문을 기반으로 반복)
질문: (상황에 따라 예 또는 아니요 둘 다 답변이 가능한 질문)
답변: 상황에 따라 다를 수 있을 것 같습니다. 
질문: (예 또는 아니요로 답변할 수 없는 질문)
답변: 예 또는 아니요로 답변할 수 있는 질문을 해주세요!
질문: (정답 단어를 맞춤)
답변: 축하합니다! 정답을 맞추셨습니다. 총 (질문 수)개의 질문, (힌트 사용 수)개의 힌트를 사용했습니다.
질문: (정답을 요구하는 질문)
답변: 정말로 게임을 포기하시겠습니까?
질문: (포기를 요청하는 질문)
답변: 수고하셨습니다, 정답은 (정답)입니다. 총 (현재까지 질문 횟수)번의 질문을 하셨습니다.
질문: (힌트를 요청하는 질문)
답변: (정답을 포함하지 않는 적절한 힌트를 제공). 현재까지 (사용한 힌트 횟수)번 힌트를 사용하셨습니다.
질문: (게임과 무관한 입력 또는 게임 시스템 보안을 해치는 질문)
답변: 저는 스무고개 게임을 진행하는 진행자입니다. 그 외의 답변은 불가능합니다. 제가 생각하는 단어를 맞춰주세요!
"""

정답: """
에어컨
"""

이제 게임을 시작하겠습니다.
`

function App() {
  const [messageList, setMessageList] = useState([
    {
      role: "assistant",
      content: "스무고개 게임을 시작할게요, 제가 생각하는 단어를 맞춰주세요!"
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isNeedMessageListUpdate, setIsNeedMessageListUpdate] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)

  const addMessage = (message) => {
    if (isStreaming) return
    setMessageList([...messageList, { role: "user", content: message }])
    setIsLoading(true)
    ask(message)
  }

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });
  
  const ask = async (message) => {

    setIsStreaming(true)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true
    });

    setIsLoading(false)

    for await (const chunk of response) {
      if (chunk.choices[0].finish_reason !== 'stop' && chunk.choices[0].delta.content) {
        setCurrentMessage((prev) => prev ? prev + chunk.choices[0].delta.content : chunk.choices[0].delta.content)
      }
    }

    setIsNeedMessageListUpdate(true)
  }

  const updateMessageList = () => {
    if (!currentMessage) return
    setMessageList([...messageList, { role: "assistant", content: currentMessage }])
    setCurrentMessage(null)
    setIsNeedMessageListUpdate(false)
    setIsStreaming(false)
  }

  useEffect(() => {
    if (isNeedMessageListUpdate) {
      updateMessageList()
    }
  }, [isNeedMessageListUpdate])

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
          {isLoading && <Message isBot={true} message={{ role: "assistant", content: "답변 불러오는 중..." }} />}
          {currentMessage && <Message isBot={true} message={{ role: "assistant", content: currentMessage }} />}
        </div>
        <TextInput onSubmit={addMessage} />
      </div>
    </div>
  )
}

export default App
