import { Dispatch, SetStateAction, useState } from "react"

export default <Type>(defaultState:Type): [Type,(attribute: string, value: any) =>void,Dispatch<SetStateAction<Type>>]=>{
    const [state, setState] = useState(defaultState)

    const setAttribute = (attribute: string, value: any) =>{
        setState({...state,[attribute]: value})
    }
    return [state, setAttribute, setState];
}