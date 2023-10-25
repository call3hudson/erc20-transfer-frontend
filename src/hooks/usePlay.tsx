import React, { useState, useEffect } from "react";

import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { RPS } from "@/abis";

type Props = {
  contractAddress: string;
  choice: number;
};

const usePlay = ({ contractAddress, choice }: Props) => {
  const { data, isError, isLoading } = useContractRead({
    address: `0x${contractAddress.slice(2)}`,
    abi: RPS,
    functionName: "stake",
  });

  const { config: configForPlay } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: RPS,
    functionName: "play",
    args: [choice + 1],
    value: data,
    scopeKey: `usePlay`,
  });

  const {
    data: dataForPlay,
    write: writeForPlay,
    isLoading: loadingForWrite,
  } = useContractWrite(configForPlay);

  const [loading, setLoading] = useState(false);

  const { isLoading: loadingForPlay } = useWaitForTransaction({
    hash: dataForPlay?.hash,
  });

  useEffect(() => {
    if (data === undefined || isLoading) setLoading(true);
    if (loadingForPlay || loadingForWrite) setLoading(true);
    else setLoading(false);
  }, [data, isError, isLoading, loadingForPlay, loadingForWrite]);

  return { loading, dataForPlay, writeForPlay };
};

export default usePlay;
