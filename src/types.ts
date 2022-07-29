import { SyntheticEvent } from 'react';
import { ethers } from 'ethers';
import { MarketItemState } from './constants';

export type Item = {
    tokenId:number,
    itemId?:number,
    price?:number,
    seller?:string
}

export type MarketPlaceItem = {
    tokenId:number,
    nft:string,
    itemId:number,
    price:number,
    seller:string,
    state: MarketItemState
}

export type ComponentProps = {
    marketplace: ethers.Contract, 
    account: string,
    signer: ethers.providers.JsonRpcSigner,
    nft:ethers.Contract
}

export type MetadataType = {
    totalPrice: number | undefined,
    price: number | undefined,
    tokenId: number,
    itemId: number | undefined,
    href: string,
    seller: string | undefined,
    name: string,
    description: string,
    imageSrc: string,
    imageAlt: string,
    attributes?: Array<{trait_type:string,value:string}> | undefined,
    contract: string
}


export type ListingsPageProps = ComponentProps & {
    listedItems: MarketPlaceItemsByContract,
    myListedItems: MarketPlaceItemsByContract,
    loadListedItems: (marketplace:ethers.Contract)=>Promise<void>
}

export type MetadataProduct = MetadataType & {
    collection: string,
    onClickHandler: (e:SyntheticEvent)=>void,
    buttonText:string,
}

export type txItem = {
    from:string,
    to:string,
    tokenId:number
}

export type MarketPlaceItemsByContract = {[key: string]: Array<MarketPlaceItem>}


export type CardItem = {
    href:string,imageSrc:string, imageAlt:string,
    name:string,description:string, children?:React.ReactNode
}