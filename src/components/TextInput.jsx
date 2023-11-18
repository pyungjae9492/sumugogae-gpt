import { useState, useRef } from "react"


export const TextInput = (props) => {
    const { onSubmit } = props

    const [inputValue, setInputValue] = useState('')

    const onClickHandler = () => {
        onSubmit(inputValue)
        setInputValue('')
    }

    const onChangeHandler = (e) => {
        setInputValue(e.target.value)
    }

    return (
        <div className='flex flex-row gap-2 w-full h-10'>
          <input 
            className='w-full h-full focus:outline-none p-2 rounded-xl'
            value={inputValue}
            onChange={onChangeHandler}
          />
          <button 
            className='w-14 h-full bg-slate-500 text-white p-2 rounded-xl'
            onClick={onClickHandler}
        >
            GO!
          </button>
        </div>
    )
}