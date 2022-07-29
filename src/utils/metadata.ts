import { Item, MetadataType, txItem } from './../types';
import { ethers } from "ethers";

type Props = {
    item: Item,
    contract: ethers.Contract,
    marketplace: ethers.Contract
}

export const supportedContracts = [
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    '0xfb7e002151343efa2a3a5f2ea98db0d21efb75ce',
    '0x7851dcc90e79f3f2c59915e7f4d6fabd8d3d305b',
    '0x4Da9Ea3ba93587c65f05ee093a49F2A3fC9e9602',
    '0xc0dED6D98FecAF686Ec02240D649FC8E068E5169'
]

export const loadMetadata = async ({ item, contract, marketplace }: Props): Promise<MetadataType> => {
    try {
        const uri = await contract.tokenURI(item.tokenId);
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = item.itemId ? await marketplace.getTotalPrice(item.itemId) : 0
        return {
            totalPrice: totalPrice,
            price: item?.price,
            tokenId: item.tokenId,
            itemId: item.itemId,
            href: `/collection/${contract.address}/${item.tokenId}`,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            imageSrc: metadata.image,
            imageAlt: metadata.name,
            attributes: metadata.attributes,
            contract: contract.address
        }
    } catch (err) {
        console.log('data start')
        console.log('token id:', item.tokenId)
        console.log('contract name', await contract.name())
        console.log('contract address', contract.address)
        console.log('data end', err)
        return {} as Promise<MetadataType>
    }

}



export const getCollection = async (contract: ethers.Contract) : Promise<Array<txItem>> => {
    const filter = contract.filters.Transfer(null, null)
    const results = await contract.queryFilter(filter)
    // if (results.length <= 0) return Promise.reject(`No collection found for contract ${contract.address}`);
    if (results.length <= 0) return Promise.resolve([]);
    const uniqueResults = results.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.args?.tokenId.toNumber() === value.args?.tokenId.toNumber()
        ))
    )
    const collection: Array<txItem> = uniqueResults.map(res=>res.args! as unknown as txItem)
    return collection
}