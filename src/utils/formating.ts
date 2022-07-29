import { ethers } from "ethers"

export const formatPrice = (wei: number | string | undefined) =>{
    return Number(ethers.utils.formatEther(wei + ''))
}