import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ProductGrid from "../../src/components/ProductGrid";
import { MarketItemState } from "../../src/constants";
import { loadMetadata } from "../../src/utils/metadata";
import ERC721 from '../../src/contractABIs/ERC721.json'
import { ComponentProps, MarketPlaceItem, MetadataType } from "../../src/types";

export default ({ marketplace, account, signer } : ComponentProps) => {
    const [state, setState] = useState<{loading:boolean,listedItems:Array<MetadataType>,soldItems:Array<MetadataType>}>({ loading: true, listedItems: [], soldItems: [] })
    const { loading, listedItems, soldItems } = state;

    const loadListedItems = async () => {
        let listedNFTs: Array<MarketPlaceItem>;
        try{
            listedNFTs= await marketplace.fetchListedItems();
        }catch(err){
            console.log('no marketplace contract')
            setState({loading:false, soldItems:[], listedItems:[]})
            return;
        }
        let soldItems:Array<MetadataType> = []
        const listed = await Promise.all(listedNFTs.map(async item=> {
            const contract = new ethers.Contract(item.nft, ERC721.abi, signer)
            const obj = await loadMetadata({item,contract,marketplace})
            return obj
        }))
        // listedNFTs.forEach(async item=> {
        //     console.log(item.seller === account)
        //     if (item.seller === account) {
        //         const contract = new ethers.Contract(item.nft, ERC721.abi, signer);
        //         const auxItem = await loadMetadata({item,contract,marketplace});
        //         auxlistedItems.push(auxItem)
        //         console.log(auxlistedItems)
        //         if (item.state === MarketItemState.Sold) {
        //             soldItems.push(auxItem)
        //         }
        //     }
        // })
        console.log('completed',listed)
        setState({loading:false, soldItems, listedItems: listed })
        
    }

    useEffect(() => {
        loadListedItems();
    }, [account])

    if (loading) return (
        <main className='p-1'>
            <h2>Loading...</h2>
        </main>
    )
        
    return (
        <div>
            {listedItems.length > 0 ? <div>
                <h2 className="text-center text-base font-medium text-black-500">Listed</h2>
                <ProductGrid items={listedItems} buyHidden/>
            </div>   : (
                <main className='p-1'>
                    <h2>No listed assets</h2>
                </main>
            )}
            {soldItems.length > 0 ? <div>
                <h2 className="text-center text-base font-medium text-black-500">Sold</h2>
                <ProductGrid items={soldItems} sold/>
            </div> : null}
        </div>
    )
}