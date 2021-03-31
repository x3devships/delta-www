/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import { ProgressBarCountDown } from '../ProgressBar';
import { errors, formatting, transactions } from '../../helpers';
import { DeltaPanel, DeltaSection } from '../Section';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { DeltaTitleH4 } from '../Title';
import { DeltaTitleH1 } from '../Title';
import DeltaButton from '../Button/DeltaButton';
import React from 'react'

const HeroIntro = () => {
  const yam = useYam();
  const wallet = useWallet();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const [APY, setAPY] = React.useState({error : 'loading'});
  const [apyRefresher, setApyRefresher] = React.useState(0);
  const [internalSet, setIntervalSet] = React.useState(false);

  React.useEffect(() => { fetchAPY()}, [])

  console.table({...APY.eth})

  const fetchAPY = async () => {
   const apyResponse = await fetch('https://corecharts.info/apy').then(response => {
      if (response.status != 200) {
       return { error : "Coudn't fetch APY"}
      }
      return response.json()
   }).then(r => {
      return r
    })

    setAPY(apyResponse)
  }

  const apyDisplay = (apyNumber) => {
    if (apyNumber === undefined) return;

    apyNumber = apyNumber.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })


    return apyNumber + "%*"
  }

  return <div className="w-full border-2 mt-4 border-black py-4 px-3 md:py-8 md:px-12 m-auto ">
    <div>
 
     <div>
       <DeltaTitleH1>
      <div className="flex justify-start ">
        <div className="w-1/2">
          Current Deep <br /> Farming Vault APY
        </div>
          <div className="w-1/2 flex flex-col md:flex-row md:justify-around">
            <div className="  flex flex-col font-thin">
              DELTA APY
              <span className="font-sans flex flex-col md:flex-row">
                {APY.error ? APY.error : apyDisplay(APY.eth.yearly.delta * 10)}
              </span>
            </div>
            <div className=" flex flex-col pt-4 md:pt-0">
              RLP APY
              <span className="font-sans flex flex-col md:flex-row">
                {APY.error ? APY.error : apyDisplay(APY.eth.yearly.rlp_uni)}
              </span>
            </div>
          </div>
      </div>
      </DeltaTitleH1>
    </div>

    <DeltaPanel requiresConnectedWallet>
   
      <DeltaPanel className="flex items-center text-center flex-wrap pt-10">
        <a href="./vault"><DeltaButton className="flex-1 mr-2 md:mr-0 md:flex-grow-0"> Go to Vault</DeltaButton></a>
          <a href="https://docs.delta.financial/"><DeltaButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0">Documentation</DeltaButton></a>
      </DeltaPanel>
    </DeltaPanel>
    </div>
  </div>

    
};

export default HeroIntro;