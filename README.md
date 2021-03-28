This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Run the site
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## How to create a static build
```bash
yarn build && yarn export
```

The static version of the app in the `out` directory.

## Simulate ending the LSW
Run a local node from the CORE-secret repo

```bash
cd ~/CORE-secret/src
yarn run build
npx hardhat node
 # Then, in a new terminal window
./liveTest.sh tests_live/operations/delta/end_lsw.js --local
```

Your local node will now have a forked mainnet that has the LSW already ending, you can point metamask to this node and test the site on localhost:3000

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Limited Staking Window
Before deploying the website when the LSW is not ready to be ended, the LSW ending can be smulated using the hardhat node and using core contract repository:

### Running with the hardhat node
In the core contracts repository start the hardhat local node. 
```
$ cd src
$ npx hardhat node --config hardhat.v076.config.js
```

> When the hardhat node is started it should show a list of account and their associated private key which can be imported to metamask.

Once started, open another window in the core contract repo and run the operation on the local hardhat node that ends the LSW. This operation also transfer some DELTA to account1.
```
$ cd src
$ ./liveTest.sh tests_live/operations/delta/end_lsw.js  --local
```

Once ran, it should display the delta token address. This address should be replaced in the one inside ```config/inodex.js``` ```addressMap.delta```

Make sure the other address listen in the console are updated as well, if needed.

In metamask, import account1 and connect to the local RPC localhost network. Chain id should be set to 1 and the other values left to default.
