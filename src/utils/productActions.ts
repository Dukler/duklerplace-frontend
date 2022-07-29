import { BigNumberish, ethers } from "ethers";

type newListingProps = approvalProps & {
    item: {tokenId:number|string|BigNumberish},
    price: string | number
}


type approvalProps = {
    contract: ethers.Contract,
    marketplace: ethers.Contract,
    account: string
}

type buyProps = approvalProps & {
    item: {itemId:number|string|BigNumberish, totalPrice:number|string|BigNumberish}
}

export const newListing = async ({item, contract, marketplace, account, price} :newListingProps) =>{
    const listingPrice = ethers.utils.parseEther(price + '')
    const id = item.tokenId;
    // console.log('id',id.toString())
    return Promise.all([
        await approvalForAll({contract, marketplace, account}),
        await (await marketplace.newListing(contract.address, id, listingPrice)).wait()
    ])
}

export const approvalForAll = async ({contract, marketplace, account} : approvalProps) =>{
    const isApproved = await contract.isApprovedForAll(account,marketplace.address)
    if(!isApproved) return await (await contract.setApprovalForAll(marketplace.address, true)).wait()
    return Promise.resolve(true)
}

export const buyItem = async ({contract, marketplace, account, item}:buyProps) =>{
    return Promise.all([
        await approvalForAll({contract, marketplace, account}),
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    ])
}

