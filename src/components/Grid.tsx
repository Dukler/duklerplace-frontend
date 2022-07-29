import { useEffect, useState } from "react"
import Pagination from "./Pagination";

type Props<InputType,OutputType> = {
    children: (item: OutputType, index: number) => React.ReactNode,
    data: Array<InputType>,
    pageSize?: number,
    loadItem: (item: InputType) => Promise<OutputType>
}
export default function Grid<InputType,OutputType>({ children, data, pageSize = 20, loadItem }: Props<InputType,OutputType>) {
    const [matrix, setMatrix] = useState<InputType[][]>([]);
    const [currentArr, setCurrentArr] = useState<OutputType[]>([])
    const [currentPage, setCurrentPage] = useState<number>(0);

    const loadArray = async (arr:Array<InputType>) => {
        setCurrentArr(await Promise.all(arr.map(async item => await loadItem(item))))
    }

    useEffect(() => {
        if(matrix.length>0)loadArray(matrix[currentPage])
    }, [currentPage, matrix])

    useEffect(() => {
        const auxMatrix = [];
        for (let index = 0; index < data.length; index += pageSize) {
            auxMatrix.push(data.slice(index, index + pageSize))
        }
        setMatrix(auxMatrix)
    }, [])

    return (
        <div className="bg-white">
            {matrix.length > 0 ? <><div className="max-w-2xl mx-auto py-6 pb-32 px-4 md:px-6 lg:max-w-max lg:px-8">
                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 gap-x-6 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-8">
                    {currentArr.map((item, index) => children(item, index))}
                </div>
            </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} length={matrix.length} />
            </> : null}
        </div>
    )
}
