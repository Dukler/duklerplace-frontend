import type { NextPage } from 'next';
import { useState,  ReactNode } from 'react';
import useWeb3 from '../hooks/useWeb3';

import Navbar from './Navbar';

interface Props {
    children : ReactNode,
    web3Handler : ()=> Promise<void>,
    account: string
}

const Layout: NextPage<Props> = ({children, web3Handler, account}) => {

  return (
    <>
      <Navbar web3Handler={web3Handler} account={account}/>
      <div className='pt-4'>
        {children}
      </div>
    </>
  )
}

export default Layout
