import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getCollection, loadMetadata, supportedContracts } from "../src/utils/metadata";
import ERC721 from '../src/contractABIs/ERC721.json'
import Card, { CardFooter, CardHeader } from "../src/components/Card";
import Grid from "../src/components/Grid";
import { CardItem, ComponentProps } from "../src/types";

type exploreItem = {
    tokenId: number,
    contract: ethers.Contract,
    totalSupply: number
}



export default ({ marketplace, account, signer }: ComponentProps) => {
    const [state, setState] = useState<{ loading: boolean, collections: Array<exploreItem> }>({ loading: true, collections: [] })
    const { collections, loading } = state;

    const loadCollections = async () => {
        let auxCollections = []
        for (let tokenAddress of supportedContracts) {
            const contract = new ethers.Contract(tokenAddress, ERC721.abi, signer)
            const collection = await getCollection(contract)
            if(collection.length === 0) continue;
            const tokenId = collection[0]!.tokenId;
            const exampleItem: exploreItem = {
                tokenId,
                contract,
                totalSupply:collection.length
            }
            auxCollections.push(exampleItem)
        }
        setState({ loading: false, collections: auxCollections })
    }

    const loadItem = async (item:exploreItem)=>{
        const contract = item.contract;
        const auxItem = await loadMetadata({item, contract, marketplace});
        const name = await contract.name();
        return {
            ...auxItem,
            name,
            description: `${name} collection of ${item.totalSupply} NFTs`,
            href:`/collection/${contract.address}`
        }
    }


    useEffect(() => {
        loadCollections();
    }, [account])

    return (
        <div>
            {collections.length > 0 ? <div>
                <h2 className="text-center text-base font-medium text-black-500">Collections</h2>
                <Grid<exploreItem, CardItem> data={collections} loadItem={loadItem} >
                    {( item, index) => (
                        <Card key={index}>
                            <CardHeader {...item} />
                            <CardFooter {...item} />
                        </Card>
                    )}
                </Grid>
            </div> : (
                <main className='p-1'>
                    {/* <h2>No nft's minted from supported collections</h2> */}
                </main>
            )}
        </div>
    )
}