import { I18nProvider } from "next-rosetta";
import { UseWalletProvider } from "use-wallet";
import { WEB3_PROVIDER_URL } from "../config";
import { WalletProvider, YamProvider, Web3Provider, SettingsProvider } from "../contexts";
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <Providers {...pageProps}>
      <Component {...pageProps} />
    </Providers>
  );
}

const Providers = props => {
  return <>
    <I18nProvider table={props.table}>
      <SettingsProvider>
        <UseWalletProvider chainId={1} connectors={{ walletconnect: { rpcUrl: WEB3_PROVIDER_URL } }}>
          <WalletProvider>
            <YamProvider>
              <Web3Provider>
                {props.children}
              </Web3Provider>
            </YamProvider>
          </WalletProvider>
        </UseWalletProvider>
      </SettingsProvider>
    </I18nProvider>
  </>;
};

export default App;
