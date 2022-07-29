import { ethers } from "ethers"

export const formatPrice = (wei) =>{
    return Number(ethers.utils.formatEther(wei))
}