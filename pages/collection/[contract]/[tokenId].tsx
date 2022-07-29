import { ethers } from "ethers";
import { useRouter } from "next/router";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import Modal from "../../../src/components/Modal";
import ProductOverview from "../../../src/components/ProductOverview";
import { MarketItemState } from "../../../src/constants";
import ERC721 from '../../../src/contractABIs/ERC721.json'
import { ListingsPageProps, MetadataProduct } from "../../../src/types";
import { loadMetadata } from "../../../src/utils/metadata";
import { approvalForAll, buyItem, newListing } from "../../../src/utils/productActions";




export default ({ marketplace, account, signer, listedItems, loadListedItems }: ListingsPageProps) => {
    const [state, setState] = useState<{loading:boolean,product:MetadataProduct}>({ loading: true, product:{} as MetadataProduct})
    const [price, setPrice] = useState('')
    const [open, setOpen] = useState(false)
    const { product, loading } = state;
    const { asPath } = useRouter();
    const tokenAddress = asPath.split('/')[2];
    const tokenId = Number(asPath.split('/')[3]);

    const listItem = async (item: MetadataProduct) => {
        const contract = new ethers.Contract(item.contract, ERC721.abi, signer)
        await newListing(item,contract,marketplace,account,price);
        await loadListedItems(marketplace);
    }

    const onClickHandler = async () =>{
        await listItem(product);
        setOpen(false)
    }
    const loadProduct = async () => {
        const contract = new ethers.Contract(tokenAddress, ERC721.abi, signer);
        const contractName = await contract.name();
        const auxItem = listedItems[tokenAddress]?.filter(item => Number(item.tokenId) === tokenId)[0]
        const item = await loadMetadata({ item: auxItem ? auxItem : { tokenId }, contract, marketplace })
        const isListed = auxItem?.state === MarketItemState.Listed ? true : false;
        const owner = isListed ? auxItem.seller : await contract.ownerOf(tokenId);
        const isOwner = owner === account;
        const buttonText = isOwner ? isListed ? 'Cancel listing' : 'Sell' : 'Buy';
        const onClickHandler = async(e:SyntheticEvent) => {
            e.preventDefault();
            if (isListed && isOwner) {
                await approvalForAll(contract,marketplace,account)
                await marketplace.cancelListing(item.itemId)
            }else if(isListed) {
                await buyItem(contract,marketplace,account,item);
                loadProduct()
            }
            else {
                setOpen(true);
            }
            
        };
        const auxProduct = {
            collection: contractName,
            onClickHandler,
            buttonText,
            ...item
        }
        setState({ loading: false, product: auxProduct })
    }

    useEffect(() => {
        loadProduct();
    }, [listedItems])
    return loading ? null : <>
        <Modal onChangeHandler={(e:ChangeEvent<HTMLInputElement>)=>setPrice(e.target.value)} open={open} setOpen={setOpen} onClickHandler={onClickHandler}/>
        <ProductOverview product={product} />
    </>
}