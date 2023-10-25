import React, { useState, useEffect } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { RPS } from "@/abis";

type Props = {
  contractAddress: string;
};

const useCheckATimeout = ({ contractAddress }: Props) => {
  const { config: configForATimeout } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: RPS,
    functionName: "j1Timeout",
    scopeKey: `useCheckATimeout`,
  });

  const {
    data: dataForATimeout,
    write: writeForATimeout,
    isLoading: loadingForWrite,
  } = useContractWrite(configForATimeout);

  const [loading, setLoading] = useState(false);

  const { isLoading: loadingForATimeout } = useWaitForTransaction({
    hash: dataForATimeout?.hash,
  });

  useEffect(() => {
    if (loadingForATimeout || loadingForWrite) setLoading(true);
    else setLoading(false);
  }, [loadingForATimeout, loadingForWrite]);

  return { loading, dataForATimeout, writeForATimeout };
};

export default useCheckATimeout;
