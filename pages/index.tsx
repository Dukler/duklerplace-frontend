import { ethers } from 'ethers';
import type { NextPage } from 'next';
import { SyntheticEvent, useEffect, useState } from 'react';
import ProductGrid from '../src/components/ProductGrid';
import { MarketItemState } from '../src/constants';
import ERC721 from '../src/contractABIs/ERC721.json'
import { ComponentProps, MetadataType } from '../src/types';
import { loadMetadata } from '../src/utils/metadata';



const Home: NextPage<ComponentProps> = ({ marketplace, signer }) => {
  const [items, setItems] = useState<Array<MetadataType>>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  const loadMarketplaceItems = async () => {
    let itemCount = 0
    try{
      itemCount = await marketplace.itemCount()
    }
    catch(err){
      setLoading(false)
      console.log('no marketplace')
      return
    }
    let items:Array<MetadataType> = [];
    for (let index = 1; index <= itemCount; index++) {
      const item = await marketplace.items(index)
      if (item.state === MarketItemState.Listed) {
        const contract = new ethers.Contract(item.nft, ERC721.abi, signer)
        items.push(
          await loadMetadata({item,contract,marketplace})
        )
      }
    }
    
    setItems(items)
    setLoading(false)
  }

  const buyMarketItem = async (item:MetadataType, event:SyntheticEvent) => {
    event.preventDefault();
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main className='p-1'>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div>
      {items.length > 0 ? <ProductGrid items={items} onButtonClick={buyMarketItem}/> : (
        <main className='p-1'>
          <h2>No listed assets</h2>
          {/* <ProductGrid/> */}
        </main>
      )}
    </div>
  )
}

export default Home
