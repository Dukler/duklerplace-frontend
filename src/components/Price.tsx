import Ethereum from "../icons/Ethereum.png"
import Image from 'next/image'
import { ChangeEvent } from "react"

export default function Price({onChangeHandler}: {onChangeHandler:(e:ChangeEvent<HTMLInputElement>)=>void}) {
    return (
      <div>
        {/* <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label> */}
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* <span className="text-gray-500 sm:text-sm">$</span> */}
            <Image src={Ethereum} width={16} height={18} />
          </div>
          <input
            type="number"
            min={0}
            step={0.01}
            name="price"
            id="price"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
            aria-describedby="price-currency"
            onChange={onChangeHandler}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              ETH
            </span>
          </div>
        </div>
      </div>
    )
  }
  