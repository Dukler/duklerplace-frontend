import { ethers } from "ethers"
import Ethereum from "../icons/Ethereum.png"
import Image from 'next/image'
import { formatPrice } from "../utils/formating"
import Link from "next/link"
import { MetadataType } from "../types"
import { SyntheticEvent } from "react"


type Props = {
    items: Array<MetadataType>,
    buyHidden?: boolean | undefined,
    sold?: boolean | undefined,
    listing?: boolean | undefined,
    onButtonClick?: (item: any, index: SyntheticEvent) => void
}
export default function ProductGrid({ items, buyHidden, sold, listing, onButtonClick }: Props) {
    const footerText = () => {
        return sold ? 'Sold for:' : 'Price:'
    }

    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {items.map((product, index) => (product ?

                        <a key={index} className='border-2 border-solid rounded-lg bg-slate-100'>
                            <Link href={product.href}>
                                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 group">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-center object-cover group-hover:opacity-75"
                                    />
                                </div>

                            </Link>
                            <h3 className="ml-1 mt-4 text-sm text-gray-700">{product.name}</h3>
                            {product.price ? <div className="ml-1 mt-1 text-lg font-medium text-gray-900">
                                <div className="flex flex-row items-center content-center">
                                    <p className="mr-1">{footerText()}</p>
                                    <Image src={Ethereum} width={18} height={20} />
                                    {formatPrice(product.totalPrice)}
                                </div>
                            </div> : null}
                            {(product.price && !listing || !product.price && listing) && onButtonClick ? <button onClick={(e) => onButtonClick(product, e)} className={`${buyHidden || sold ? 'hidden' : ''} w-full whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700`}>
                                {listing ? 'List' : 'Buy now'}
                            </button> : null}
                        </a> : null
                    ))}
                </div>
            </div>
        </div>
    )
}
