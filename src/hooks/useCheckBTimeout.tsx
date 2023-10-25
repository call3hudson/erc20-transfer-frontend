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

const useCheckBTimeout = ({ contractAddress }: Props) => {
  const { config: configForBTimeout } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: RPS,
    functionName: "j2Timeout",
    scopeKey: `useCheckBTimeout`,
  });

  const {
    data: dataForBTimeout,
    write: writeForBTimeout,
    isLoading: loadingForWrite,
  } = useContractWrite(configForBTimeout);

  const [loading, setLoading] = useState(false);

  const { isLoading: loadingForBTimeout } = useWaitForTransaction({
    hash: dataForBTimeout?.hash,
  });

  useEffect(() => {
    if (loadingForBTimeout || loadingForWrite) setLoading(true);
    else setLoading(false);
  }, [loadingForBTimeout, loadingForWrite]);

  return { loading, dataForBTimeout, writeForBTimeout };
};

export default useCheckBTimeout;
