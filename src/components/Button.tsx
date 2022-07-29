import { SyntheticEvent } from "react"

export default ({text, onButtonClick}:{text:string, onButtonClick:(e:SyntheticEvent)=>void}) => {
    return (
        <button onClick={(e) => onButtonClick(e)}
            className={`w-full whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700`}>
            {text}
        </button>
    )
}