import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props ={
    setCurrentPage: Dispatch<SetStateAction<number>>, 
    currentPage: number, 
    length: number
}

export default function Pagination({ setCurrentPage, currentPage, length } : Props) {
    const [block, setCurrentBlock] = useState<Array<number>>([])
    const maxAmount = 10;

    useEffect(() => {
        setCurrentBlock(Array.from(Array(10)).map((item, index) => index))
    }, [])

    useEffect(() => {
        const currentMax = block[maxAmount - 1];
        const currentMin = block[0];
        if (currentPage > currentMax) setCurrentBlock(block.map((item) => {
            return item + maxAmount;
        }))
        if (currentPage < currentMin) setCurrentBlock(block.map((item) => {
            return item - maxAmount;
        }))
    }, [currentPage])

    const prevPage = () => {
        if (currentPage === 0) return
        setCurrentPage(currentPage - 1);
    }

    const nextPage = () => {
        if (currentPage === length || currentPage+1 === length) return
        setCurrentPage(currentPage + 1);
    }

    const onClickHandler = (index:number) =>{
        if(index >= length || index <= 0) return;
        setCurrentPage(index)
    }

    const isCurrent = {
        'aria-current': "page",
        'className': "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium w-[50px] justify-center"
    }
    const isNotCurrent = {
        className: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium w-[50px] justify-center"
    }
    const isDisabled = {
        className: "bg-white border-gray-300 text-gray-100 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium w-[50px] justify-center disabled"
    }

    return (
        <div className={`${length <= maxAmount ? 'hidden': ''} bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 select-none fixed inset-x-0 bottom-0`}>
            <div className="flex-1 flex justify-between sm:hidden">
                <a

                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Previous
                </a>
                <a

                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between ">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{maxAmount}</span> of{' '}
                        <span className="font-medium">{length}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px min-w-[560px] max-w-[560px] w-[560px]" aria-label="Pagination">
                        <a
                            onClick={prevPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                        {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                        {block.map((item) => {
                            const pageProps = item === currentPage ? isCurrent : isNotCurrent;
                            const auxProps = item >= length ? isDisabled : pageProps;
                            return <a key={item} {...auxProps} onClick={(e) => onClickHandler(item)}>{item + 1}</a>
                        })}
                        <a
                            onClick={nextPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}
