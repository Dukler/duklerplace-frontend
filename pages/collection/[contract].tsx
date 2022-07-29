import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getCollection, loadMetadata, supportedContracts } from "../../src/utils/metadata";
import ERC721 from '../../src/contractABIs/ERC721.json'
import Card, { CardFooter, CardHeader } from "../../src/components/Card";
import Grid from "../../src/components/Grid";
import { useRouter } from "next/router";
import { CardItem, ComponentProps, MetadataType, txItem } from "../../src/types";



export default ({ marketplace, account, signer }: ComponentProps) => {
    const [state, setState] = useState<{ loading: boolean, collection: Array<txItem>, name: string }>({ loading: true, collection: [], name: '' })
    const [contract, setContract] = useState<ethers.Contract>()
    const { collection, loading, name } = state;
    const { asPath } = useRouter();
    

    const loadCollection = async () => {
        const tokenAddress = asPath.split('/')[2];
        const contract = new ethers.Contract(tokenAddress, ERC721.abi, signer);
        setContract(contract);
        const col = await getCollection(contract);
        setState({ loading: false, collection: col, name })
    }

    const loadItem = async (item : txItem)=>{
        const tokenAddress = asPath.split('/')[2];
        const contract = new ethers.Contract(tokenAddress, ERC721.abi, signer);
        const auxItem = await loadMetadata({item, contract, marketplace})
        auxItem.href = `${asPath}/${auxItem?.tokenId}`;
        return auxItem
    }


    useEffect(() => {
        loadCollection();
    }, [account])

    if (loading) return (
        <main className='p-1'>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div>
            {collection.length > 0 ? <div>
                <h2 className="text-center text-base font-medium text-black-500">{`Colection ${name}`}</h2>
                <Grid<txItem,CardItem> data={collection} loadItem={loadItem}>
                    {( item, index) => 
                        <Card key={index}>
                            <CardHeader {...item}/>
                            <CardFooter {...item} />
                        </Card>
                    }
                </Grid>
            </div> : (
                <main className='p-1'>
                    <h2>No nft's minted from this collection</h2>
                </main>
            )}
        </div>
    )
}