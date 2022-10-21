import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import UploadForm from "../../src/components/UploadForm";
import useComplexState from "../../src/hooks/useComplexState";
import { approvalForAll } from "../../src/utils/productActions";
import { ComponentProps } from "../../src/types";
import * as IPFSCORE from 'ipfs-core'

import { create as ipfsHttpClient, Options } from "ipfs-http-client";
// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0" as Options);
// const client = ipfsHttpClient("https://ipfs-gateway.cloud/" as Options);

// const client = await IPFSCORE.create()
// type IPFSType = Awaited<ReturnType<typeof IPFSCORE.create>>

const Create = ({marketplace, nft, account} : ComponentProps) =>{
    const client = {add:(file:any)=>{return{path:''}}}
    // const [client, setClient] = useState<IPFSType>({} as IPFSType)
    
    // useEffect(()=>{
    //     // prepareClient().then(res=>setClient(res))
    //     const getClient = async () =>{
    //         setClient(await IPFSCORE.create())
    //     }
    //     getClient();
    // },[])
    

    const [state, setAttribute] = useComplexState<{image:string,price:number|'',name:string,description:string}>({image:'',price:'',name:'',description:''})

    const onChangeHandler = (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const target = event.target;
        setAttribute(target.id.toString(), target.value.toString());
    }

    const uploadToIPFS = async (event:ChangeEvent<HTMLInputElement>) =>{
        event.preventDefault();
        if(!event.target.files) return
        const file = event.target.files[0]
        if(typeof file === 'undefined') return
        try{
            const result = await client.add(file)
            console.log(result)
            setAttribute('image',`https://infura-ipfs.io/ipfs/${result.path}`)
        }catch(error){
            console.log("ipfs image upload error: ", error)
        }
    }
    const createNFT = async (event:SyntheticEvent) =>{
        event.preventDefault()
        if(!state.image || !state.price || !state.name || !state.description) return
        
        const {price, ...rest} = state;
        try{
            const result = await client.add(JSON.stringify({...rest}))
            mintThenList(result)
        }catch(err){
            console.log("ips uri upload error: ",err)
        }
    }
    const mintThenList = async (result:{path:string}) =>{
        const uri = `https://infura-ipfs.io/ipfs/${result.path}`
        await (await nft.mint(uri)).wait()
        const id = await nft.totalSupply()
        // await (await nft.setApprovalForAll(marketplace.address, true)).wait()
        await approvalForAll({contract:nft,marketplace,account});
        
        const listingPrice = ethers.utils.parseEther(state.price.toString())
        await (await marketplace.newListing(nft.address, id, listingPrice)).wait()

    }

    return <UploadForm {...state} onChangeHandler={onChangeHandler} onFileUpload={uploadToIPFS} createNFT={createNFT}/>
}

export default Create;