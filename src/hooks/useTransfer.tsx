import React, { useState, useEffect } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useWatchPendingTransactions,
} from "wagmi";
import {
  writeContract,
  fetchTransaction,
  PrepareWriteContractResult,
} from "wagmi/actions";

import { ERC20 } from "@/abis";

type Props = {
  contractAddress: string;
  userAddress: string;
  amount: bigint;
  gasFee: bigint;
  priorityFee: bigint;
};

type EIP1559 = "eip1559";

const useTransfer = ({
  contractAddress,
  userAddress,
  amount,
  gasFee,
  priorityFee,
}: Props) => {
  const { config: configForTransfer } = usePrepareContractWrite({
    address: `0x${contractAddress.slice(2)}`,
    abi: ERC20,
    functionName: "transfer",
    args: [`0x${userAddress.slice(2)}`, amount],
    scopeKey: `useTransfer`,
    maxFeePerGas: gasFee,
    maxPriorityFeePerGas: priorityFee,
  });

  const {
    data: dataForTransfer,
    write: writeForTransfer,
    isLoading: loadingForWrite,
    error: errorForWrite,
  } = useContractWrite({
    ...configForTransfer,
    // request: {
    //   ...configForTransfer.request,
    //   maxFeePerGas: gasFee,
    // },
  });

  const [estimatedTime, setEstimatedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("-");
  const [statusCode, setStatusCode] = useState(0);

  const increaseGasPriorityFee = (fee: bigint) => {
    const eip1559: EIP1559 = "eip1559";
    const { gasPrice: _, ...configRequest } = {
      ...configForTransfer.request,
      maxPriorityFeePerGas: fee,
      type: eip1559,
    };
    writeContract({
      ...configForTransfer,
      request: configRequest,
    });
  };

  const { isLoading: loadingForTransfer, error: errorForWaiting } =
    useWaitForTransaction({
      hash: dataForTransfer?.hash,
    });

  useWatchPendingTransactions({
    listener: async (hashes) => {
      if (
        configForTransfer === null ||
        configForTransfer === undefined ||
        configForTransfer.request === undefined
      )
        return;
      let index = 0,
        surpassing = 1,
        currentGasFee = configForTransfer.request.maxPriorityFeePerGas ?? 0; // Include self
      for (index = 0; index < hashes.length; index++) {
        const transaction = await fetchTransaction({ hash: hashes[index] });
        if (transaction.maxPriorityFeePerGas ?? 0 > currentGasFee) surpassing++;
      }
      setEstimatedTime(12 * Math.ceil(surpassing / 380));
    },
  });

  useEffect(() => {
    if (loadingForTransfer || loadingForWrite) setLoading(true);
    else setLoading(false);

    if (loadingForWrite === true) {
      setStatus("Writing...");
      setStatusCode(1);
    } else if (loadingForTransfer === true) {
      setStatus("Waiting to be mined...");
      setStatusCode(2);
    } else if (errorForWaiting !== null) {
      setStatus("Tx broadcast failed");
      setStatusCode(3);
    } else if (errorForWrite !== null) {
      setStatus("Tx write failed");
      setStatusCode(4);
    } else {
      setStatus("Ready");
      setStatusCode(-1);
    }
  }, [loadingForTransfer, loadingForWrite, errorForWaiting, errorForWrite]);

  return {
    loading,
    estimatedTime,
    status,
    statusCode,
    dataForTransfer,
    writeForTransfer,
    increaseGasPriorityFee,
  };
};

export default useTransfer;
