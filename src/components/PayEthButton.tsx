import { ethers } from "ethers";
import Ethereum from "../icons/Ethereum";

type Props = {
    price: string
}
const PayEthButton = ({price}:Props) => {
    return (
        <button type="button" className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
            <Ethereum/>
            {ethers.utils.formatEther(price)}
        </button>
    )
}

export default PayEthButton;
