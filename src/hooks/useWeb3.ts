import { ethers } from "ethers";
import { useEffect, useState } from 'react';



const useWeb3 = ({ onMount = false } = {}) => {
    const [account, setAccount] = useState('')
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
    const [isConnected, setIsConnected] = useState(false)
    const [chainId, setChainId] = useState<number>()
    // const [canConnect, setCanConnect] = useState(onMount);

    const detectProvider = () => {
        let web3provider = null;
        if (window.ethereum) {
            web3provider = window.ethereum;
        } else if (window.web3) {
            web3provider = window.web3;
        } else {
            window.alert("No Ethereum browser detected! Check out MetaMask");
            return;
        }
        let auxProvider:ethers.providers.Web3Provider = new ethers.providers.Web3Provider(web3provider);
        updateAccount(auxProvider!)
        setProvider(auxProvider!)
        return auxProvider

    };

    const updateAccount = async (provider: ethers.providers.Web3Provider) => {
        if (provider) {
            provider.listAccounts().then(async accounts=>{
                if (accounts.length > 0){
                    const signer = await provider.getSigner()
                    setSigner(signer)
                    setAccount(accounts[0])
                    setIsConnected(true)
                }else{
                    setAccount('')
                }
            })
        } else {
            setAccount('')
        }

    }

    const connect = async () => {
        const auxProvider = detectProvider();
        if (!auxProvider) return;
        await auxProvider.send("eth_requestAccounts", []);
        updateAccount(auxProvider);
    }

    const chainChange = async (provider? : ethers.providers.Web3Provider) =>{
        const prov = provider ? provider : await detectProvider();
        if(!prov) return;
        const net = await prov.getNetwork();
        const id = Number(net.chainId);
        setChainId(id)
    }

    useEffect(() => {
        detectProvider()
        chainChange()
        if (onMount) connect()
        window.ethereum.on('accountsChanged', detectProvider)
        window.ethereum.on('chainChanged', (chain:number)=>chainChange())
        return () => {
            window.ethereum.removeListener('accountsChanged', detectProvider)
            window.ethereum.removeListener('chainChanged', chainChange)
        }
    }, [])

    return { isConnected, provider, signer, account, ethers, connect , chainId}
}

export default useWeb3