import { ethers } from "ethers";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import Modal from "../src/components/PriceModal";
import ProductGrid from "../src/components/ProductGrid";
import ERC721 from '../src/contractABIs/ERC721.json'
import { Item, ListingsPageProps, MetadataType } from "../src/types";
import { loadMetadata, supportedContracts } from "../src/utils/metadata";
import { newListing } from "../src/utils/productActions";

const tokenAddresses = supportedContracts

type Product = Item & {
    contract: string
}

export default ({ marketplace, account, signer, myListedItems, loadListedItems }: ListingsPageProps) => {
    const [state, setState] = useState<{loading:boolean,nfts:Array<MetadataType>}>({ loading: true, nfts: [] })
    const [price, setPrice] = useState('')
    const [open, setOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<Product>()
    const { loading, nfts } = state;

    const onClickHandler = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!currentItem) return;
        await listItem(currentItem)
        setOpen(false)
    }

    useEffect(()=>{
        loadOwnedNFTs()
    },[myListedItems, account])

    const listItem = async (item: Product) => {
        const contract = new ethers.Contract(item.contract, ERC721.abi, signer)
        return await Promise.all([
            await newListing({item, contract, marketplace, account, price}),
            await loadListedItems(marketplace)
        ])
    }

    const loadOwnedNFTs = async () => {
        let allNFTs: Array<MetadataType> = []

        for (let tokenAddress of tokenAddresses) {
            const contract = new ethers.Contract(tokenAddress, ERC721.abi, signer)
            const filterRecieved = contract.filters.Transfer(null, account)
            const results = await contract.queryFilter(filterRecieved)
            const uniqueResults = results.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.args?.tokenId.toNumber() === value.args?.tokenId.toNumber()
                ))
            )
            const notListed = await uniqueResults.reduce(async (resultArr: Promise<Array<MetadataType>>, data) => {
                const item = data.args as unknown as Item;
                if (!item) return await resultArr;
                const owner = await contract.ownerOf(item.tokenId)
                if (owner === account) {
                    let aux = await loadMetadata({ item, contract, marketplace })
                    aux.contract = tokenAddress;
                    const arr = await resultArr;
                    arr.push(aux)
                }
                return await resultArr;
            }, Promise.resolve([]));
            const auxListed = myListedItems[tokenAddress] ? await Promise.all(myListedItems[tokenAddress].map(async item => {
                let aux = await loadMetadata({ item, contract, marketplace });
                aux.contract = tokenAddress;
                return aux;
            })) : []
            allNFTs = [...allNFTs, ...notListed, ...auxListed]
        }
        setState({ loading: false, nfts: allNFTs })
    }


    if (loading) return (
        <main className='p-1'>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div>
            {nfts.length > 0 ? <>
                <Modal onChangeHandler={(e:ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} open={open} setOpen={setOpen} onClickHandler={onClickHandler} />
                <ProductGrid items={nfts} listing onButtonClick={(product, e) => { setOpen(true); setCurrentItem(product) }} />
            </> : (
                <main className='p-1'>
                    <h2>No purchases</h2>
                </main>
            )}
        </div>
    )
}
