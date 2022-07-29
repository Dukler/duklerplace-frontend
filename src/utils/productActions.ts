import { ethers } from "ethers";

export const newListing = async (item, contract, marketplace, account, price) =>{
    const listingPrice = ethers.utils.parseEther(price)
    const id = item.tokenId;
    // console.log('id',id.toString())
    return Promise.all([
        await approvalForAll(contract, marketplace, account),
        await (await marketplace.newListing(contract.address, id, listingPrice)).wait()
    ])
}

export const approvalForAll = async (contract, marketplace, account) =>{
    //isApprovedForAll(owner, operator)
    const isApproved = await contract.isApprovedForAll(account,marketplace.address)
    // const isApproved = false;
    // console.log(isApproved)
    if(!isApproved) return await (await contract.setApprovalForAll(marketplace.address, true)).wait()
    return Promise.resolve(true)
}

export const buyItem = async (contract, marketplace, account, item) =>{
    return Promise.all([
        await approvalForAll(contract, marketplace, account),
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    ])
}

