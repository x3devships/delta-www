import { DeltaPanel, DeltaSection } from '../Section';
import { useApy } from '../../hooks';

const ApyDisplay = () => {
  const totalApy = useApy();

  return <DeltaSection title="(D / W / Y) APY For Ethereum & Usdt">
    <DeltaPanel>
      <div className="text-center mt-2 md:mt-4 text-lg" style={{ fontSize: 27 }}> --- Ethereum --- </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Daily Apy --- Delta: ${totalApy.apy.eth_daily_delta}, LSW: ${totalApy.apy.eth_daily_rlp_lsw}, Mint: ${totalApy.apy.eth_daily_rlp_mint}, Uni: ${totalApy.apy.eth_daily_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Weekly Apy --- Delta: ${totalApy.apy.eth_weekly_delta}, LSW: ${totalApy.apy.eth_weekly_rlp_lsw}, Mint: ${totalApy.apy.eth_weekly_rlp_mint}, Uni: ${totalApy.apy.eth_weekly_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Yearly Apy --- Delta: ${totalApy.apy.eth_yearly_delta}, LSW: ${totalApy.apy.eth_yearly_rlp_lsw}, Mint: ${totalApy.apy.eth_yearly_rlp_mint}, Uni: ${totalApy.apy.eth_yearly_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg" style={{ fontSize: 27 }}> --- Usdt --- </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Daily Apy --- Delta: ${totalApy.apy.usdt_daily_delta}, LSW: ${totalApy.apy.usdt_daily_rlp_lsw}, Mint: ${totalApy.apy.usdt_daily_rlp_mint}, Uni: ${totalApy.apy.usdt_daily_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Weekly Apy --- Delta: ${totalApy.apy.usdt_weekly_delta}, LSW: ${totalApy.apy.usdt_weekly_rlp_lsw}, Mint: ${totalApy.apy.usdt_weekly_rlp_mint}, Uni: ${totalApy.apy.usdt_weekly_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg"> Yearly Apy --- Delta: ${totalApy.apy.usdt_yearly_delta}, LSW: ${totalApy.apy.usdt_yearly_rlp_lsw}, Mint: ${totalApy.apy.usdt_yearly_rlp_mint}, Uni: ${totalApy.apy.usdt_yearly_rlp_uni} </div>
      <div className="text-center mt-2 md:mt-4 text-lg"><a href = "https://corecharts.info/" style={{ textDecoration: "underline" }}>Provided by CoreCharts</a></div>
    </DeltaPanel>
  </DeltaSection>
};

export default ApyDisplay;
