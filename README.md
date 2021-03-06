This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API es](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Limited Staking Window
Before deploying the website when the LSW is not ready to be ended, the LSW ending can be smulated 
using the hardhat node and using core contract repository:

Inside ```config/index.js``` there is a variable ```TEMP_ENABLE_END_LSW_WEB3``` that can be changed from true/false.
This variable is temporary during the LSW and will be remove once the contracts are connected to the LSW and
that it's ready to be ended.

When set to false it bypasses the update of the values within the React hooks and make it possible to work on the website before the contract requirements are available.

When set to true, the hooks are going to update using web3 calls to the contracts. Once live they will communicate with the real one, when working locally using hardhat node, this will use the one deployed locally in the mainnet fork.

### Running with the hardhat node
edit ```config/index.js``` and change ```TEMP_ENABLE_END_LSW_WEB3``` to true.

This is make the hooks like useStaking and useDelta to update using web3.

In the core contracts repository start the hardhat local node. 
```
$ cd src
$ npx hardhat node
```

> When the hardhat node is started it should show a list of account and their associated private key which can be imported to metamask.

Once started, open another window in the core contract repo and run the operation on the local hardhat node that ends the LSW. This operation also transfer some DELTA to account1.
```
$ cd src
$ ./liveTest.sh tests_live/operations/delta/end_lsw.js  --local
```

Once ran, it should display the delta token address. This address should be replaced in the one inside ```config/inodex.js``` ```addressMap.delta```

In metamask, import account1 and connect to the local RPC localhost network. Chain id should be set to 1 and the other values left to default.

### Running without the hardhat node
edit ```config/index.js``` and change ```TEMP_ENABLE_END_LSW_WEB3``` to false.

When set to false this allows not updating the hooks that requires the LSW contracts and work on the website. The only limitation is
that mock values has to be use and many value will be displayed as '--' because they could not bbe updated.

