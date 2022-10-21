import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../src/components/Layout'
import useWeb3 from '../src/hooks/useWeb3';
import { useEffect, useState } from 'react';
import MarketplaceAddress from '../src/contractABIs/Marketplace-address.json'
import MarketplaceABI from '../src/contractABIs/Marketplace.json'
import NFTAddress from '../src/contractABIs/NFT-address.json'
import NFTABI from '../src/contractABIs/NFT.json'
import { ethers } from 'ethers';
import { MarketPlaceItem, MarketPlaceItemsByContract } from '../src/types';
import { MarketItemState } from '../src/constants';
import NetworkModal from '../src/components/NetworkModal';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  const { isConnected, connect, ethers, signer, account, chainId } = useWeb3();
  const [marketplace, setMarketplace] = useState<ethers.Contract>()
  const [listedItems, setListedItems] = useState<MarketPlaceItemsByContract>()
  const [myListedItems, setMyListedItems] = useState<MarketPlaceItemsByContract>()
  const [nft, setNft] = useState({})
  const [loading, setLoading] = useState(true)


  const loadContracts = async () => {
    const marketplace = new ethers.Contract(MarketplaceAddress.adress, MarketplaceABI.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.adress, NFTABI.abi, signer)
    await loadListedItems(marketplace);
    setNft(nft)
    setLoading(false);
  }
  const loadListedItems = async (marketplace: ethers.Contract) => {
    let itemCount = 0;
    try {
      itemCount = await marketplace.itemCount()
    } catch (err) {
      console.log('marketplace contract not found', err)
    }
    let items: Array<MarketPlaceItem> = [];
    for (let index = 1; index <= itemCount; index++) {
      const item = await marketplace.items(index)
      if (item.state === MarketItemState.Listed) {
        items.push(item)
      }
    }
    let listedNFTsByContract: MarketPlaceItemsByContract = {};
    let myListedNFTsByContract: MarketPlaceItemsByContract = {};
    items.forEach(element => {
      if (!element.nft) return;
      if (!listedNFTsByContract[element.nft]) listedNFTsByContract[element.nft] = [];
      if (!myListedNFTsByContract[element.nft]) myListedNFTsByContract[element.nft] = [];
      listedNFTsByContract[element.nft].push(element);
      if (element.seller === account) myListedNFTsByContract[element.nft].push(element)
    });
    setListedItems(listedNFTsByContract)
    setMyListedItems(myListedNFTsByContract)
  }
  const blockchainProps = { marketplace, nft, account, signer, listedItems, myListedItems, loadListedItems };

  useEffect(() => {
    if (!loading && marketplace) loadListedItems(marketplace)
  }, [account, loading])

  useEffect(() => {
    if (isConnected) loadContracts()
  }, [isConnected])

  return <Layout web3Handler={connect} account={account}> {!loading ?
    <>
        <Script
          src="https://cdn.jsdelivr.net/npm/ipfs-core/dist/index.min.js"
          strategy="beforeInteractive"
        ></Script>
      <NetworkModal chainId={chainId}/>
      <Component {...pageProps} {...blockchainProps} />
    </>
    : null} </Layout>
}

export default MyApp
