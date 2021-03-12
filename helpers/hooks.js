const setWalletAwareInterval = (wallet, fn, timeout, ...fnPrams) => {
    if (!("status" in wallet)) {
        throw new Error("wallet parameter must be a valid use-wallet instance");
    }

    const isWalletConnected = () => {
        return wallet && wallet.account && wallet.status === "connected";
    };

    if (isWalletConnected()) {
        fn(fnPrams);
    }

    const interval = setInterval(() => {
        if (isWalletConnected()) {
            fn(fnPrams);
        }
    }, timeout);

    return interval;
};

export default {
    setWalletAwareInterval
};
