This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Run the site
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
