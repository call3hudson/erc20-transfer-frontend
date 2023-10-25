import React, { useState, useEffect } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { RPS } from "@/abis";

type Props = {
  contractAddress: string;
  choice: number;
  saltNumber: number;
};

const useSolve = ({ contractAddress, choice, saltNumber }: Props) => {
  const { config: configForSolve } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: RPS,
    functionName: "solve",
    args: [choice + 1, BigInt(saltNumber)],
    scopeKey: `useSolve`,
  });

  const {
    data: dataForSolve,
    write: writeForSolve,
    isLoading: loadingForWrite,
  } = useContractWrite(configForSolve);

  const [loading, setLoading] = useState(false);

  const { isLoading: loadingForSolve } = useWaitForTransaction({
    hash: dataForSolve?.hash,
  });

  useEffect(() => {
    if (loadingForSolve || loadingForWrite) setLoading(true);
    else setLoading(false);
  }, [loadingForSolve, loadingForWrite]);

  return { loading, dataForSolve, writeForSolve };
};

export default useSolve;
