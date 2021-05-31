/* eslint-disable react/no-danger */
import React from 'react';
import { useRouter } from 'next/router'
import { DeltaPanel, } from '../Section';
import { useApy, } from '../../hooks';
import DeltaButton from '../Button/DeltaButton';
import { DeltaTitleH1 } from '../Title';
import { gitbookUrl } from '../../config';

const HeroIntro = () => {
  const apy = useApy();
  const router = useRouter()

  const goToVaultPage = e => {
    e.preventDefault();
    router.push('/vault');
  };

  return <div className="w-full border-2 mt-4 border-black py-4 px-3 md:py-8 md:px-12 m-auto ">
    <div>
      <div>
        <DeltaTitleH1>
          <div className="flex flex-col md:flex-row">
            <div className="flex self-start flex-grow md:hidden">
              Current Deep Farming Vault APY
            </div>
            <div className="hidden md:flex self-start flex-grow">
              Current Deep <br /> Farming Vault APY
            </div>
            <div className="flex flex-col md:flex-row mt-4 md:mt-0">
              <div className="flex flex-col mr-4">
                DELTA APY
                <span className="font-gt_america flex">up to {apy.eth_yearly_delta} %*</span>
              </div>
              <div className=" flex flex-col pt-4 md:pt-0">
                RLP APY
                <span className="font-gt_america flex">{apy.eth_yearly_rlp_uni} %*</span>
              </div>
            </div>
          </div>
        </DeltaTitleH1> 
      </div>

      <DeltaPanel >
        <DeltaPanel className="flex items-center text-center flex-wrap mt-4">
          <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={goToVaultPage}>Go to vault</DeltaButton>
          <a className="flex-1 md:flex-grow-0" target="_blank" href={gitbookUrl} rel="noopener noreferrer">
            <DeltaButton  >Documentation</DeltaButton>
          </a>
        </DeltaPanel>
      </DeltaPanel>
    </div>
  </div>


};

export default HeroIntro;