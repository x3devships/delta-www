
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const VALUE_REFRESH_INTERVAL = 30 * 1000;
const initialState = DATA_UNAVAILABLE;
const useRlpRouter = () => {
    const web3 = useWeb3();
    const wallet = useWallet();
    const [LPTokenPerEthUnit, setLPTokenPerEthUnit] = useState(initialState);

    const update = async() => {
        const amountOfLPToken = await web3.contracts.deltaRouter.methods.getLPTokenPerEthUnit(amountOfEth).call();
        setLPTokenPerEthUnit(amountOfLPToken);

    };
   

    const getOptimalEthAmountForDeltaAmount = async(amountOfDelta) => {
        const optimalEthAmount = await web3.contracts.deltaRouter.methods.getOptimalEthAmountForDeltaAmount(amountOfDelta).call();
        return optimalEthAmount;
    };

    const getOptimalDeltaAmountForEthAmount = async(amountOfEth) => {
        const optimalDeltaAmount = await web3.contracts.deltaRouter.methods.getOptimalDeltaAmountForEthAmount().call();
        return optimalDeltaAmount;
    };
    
    useEffect(() => {
        let interval;
        if (web3) {
            update();
            interval = setInterval(update, VALUE_REFRESH_INTERVAL);
        }
        return () => clearInterval(interval);
    }, );   
    return {
        LPTokenPerEthUnit,
        getOptimalEthAmountForDeltaAmount,
        getOptimalDeltaAmountForEthAmount
        
    };

};
export default useRlpRouter;
