

export const Message = (props) => {

    const { isBot, message } = props

    return (
        <div key={message} className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}>
          <div className={`max-w-[80%] rounded-xl flex items-center px-4 py-2 ${isBot ? "bg-slate-500 text-white" : "bg-slate-200 text-black"}`}>
            {message.content}
          </div>
        </div>
    )
}