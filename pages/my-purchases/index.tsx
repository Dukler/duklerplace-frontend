import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ProductGrid from "../../src/components/ProductGrid";
import { loadMetadata } from "../../src/utils/metadata";
import ERC721 from '../../src/contractABIs/ERC721.json'
import { ComponentProps, Item, MetadataType } from "../../src/types";

// type MetaArr = Array<MetadataType> | undefined
type StateType = {
    loading: boolean,
    purchases: Array<MetadataType>
}

export default ({marketplace, account, signer}: ComponentProps)=>{
    const [state, setState] = useState<StateType>({loading:true, purchases:[]});
    const {loading, purchases} = state;

    const loadPurchasedItems = async () =>{
        const filter = marketplace.filters.Bought(null,null,null,null,null,account)
        const results = await marketplace.queryFilter(filter)
        
        const purchases = await Promise.all(results.map(async i =>{
            const item:Item & {nft:string} = i.args as unknown as Item & {nft:string};
            const contract = new ethers.Contract(item.nft, ERC721.abi, signer)
            const auxItem = await loadMetadata({item, contract,marketplace})
            return auxItem
        }))
        setState({loading:false,purchases})
    }

    useEffect(() => {
        loadPurchasedItems();
    }, [account])


    if (loading) return (
        <main className='p-1'>
            <h2>Loading...</h2>
        </main>
    )
        
    return (
        <div>
            {purchases.length > 0 ? <ProductGrid items={purchases} buyHidden/>: (
                <main className='p-1'>
                    <h2>No purchases</h2>
                </main>
            )}
        </div>
    )

}