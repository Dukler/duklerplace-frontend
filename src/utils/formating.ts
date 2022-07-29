import { ethers } from "ethers"

export const formatPrice = (wei: number | string) =>{
    return Number(ethers.utils.formatEther(wei))
}