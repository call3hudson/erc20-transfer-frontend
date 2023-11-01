import React, { useState, useEffect } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { ERC20 } from "@/abis";

type Props = {
  contractAddress: string;
  userAddress: string;
  amount: bigint;
};

const useTransfer = ({ contractAddress, userAddress, amount }: Props) => {
  const { config: configForTransfer } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: ERC20,
    functionName: "transfer",
    args: [`0x${userAddress.slice(2)}`, amount],
    scopeKey: `useTransfer`,
  });

  const {
    data: dataForTransfer,
    write: writeForTransfer,
    isLoading: loadingForWrite,
  } = useContractWrite(configForTransfer);

  const [loading, setLoading] = useState(false);

  const { isLoading: loadingForTransfer } = useWaitForTransaction({
    hash: dataForTransfer?.hash,
  });

  useEffect(() => {
    if (loadingForTransfer || loadingForWrite) setLoading(true);
    else setLoading(false);
  }, [loadingForTransfer, loadingForWrite]);

  return { loading, dataForTransfer, writeForTransfer };
};

export default useTransfer;
