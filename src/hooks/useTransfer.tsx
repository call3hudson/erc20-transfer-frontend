import React, { useState, useEffect } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useWatchPendingTransactions,
  usePublicClient,
  useAccount,
} from "wagmi";
import { writeContract, fetchTransaction } from "wagmi/actions";
import { validateAddress } from "@/utils";

import { ERC20 } from "@/abis";

type Props = {
  contractAddress: string;
  userAddress: string;
  amount: bigint;
  gasFee: bigint;
  priorityFee: bigint;
  tx: string;
};

const useTransfer = ({
  contractAddress,
  userAddress,
  amount,
  gasFee,
  priorityFee,
  tx,
}: Props) => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { config: configForTransfer, data: dataForPrepare } =
    usePrepareContractWrite({
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
  } = useContractWrite(configForTransfer);

  const [estimatedGas, setEstimatedGas] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speedUp, setSpeedUp] = useState(false);
  const [status, setStatus] = useState("-");
  const [statusCode, setStatusCode] = useState(0);

  const increaseGasPriorityFee = async (fee: bigint) => {
    setSpeedUp(true);
    try {
      const transaction = await fetchTransaction({ hash: `0x${tx.slice(2)}` });
      console.log(transaction.nonce);

      try {
        writeContract({
          address: `0x${contractAddress.slice(2)}`,
          abi: ERC20,
          functionName: "transfer",
          args: [`0x${userAddress.slice(2)}`, amount],
          nonce: transaction.nonce,
          maxFeePerGas: gasFee,
          maxPriorityFeePerGas: fee,
        });
      } catch {
        setSpeedUp(false);
      }
    } catch {
      setSpeedUp(false);
    }
    setSpeedUp(false);
  };

  useEffect(() => {
    const fetch = async () => {
      if (
        address === undefined ||
        !validateAddress(contractAddress).valid ||
        !validateAddress(userAddress).valid
      )
        return;
      const request = await publicClient.estimateContractGas({
        address: `0x${contractAddress.slice(2)}`,
        abi: ERC20,
        functionName: "transfer",
        args: [`0x${userAddress.slice(2)}`, amount],
        account: address,
      });

      setEstimatedGas(Number(request));
    };

    fetch();
  }, [contractAddress, userAddress, amount, address]);

  const { isLoading: loadingForTransfer, error: errorForWaiting } =
    useWaitForTransaction({
      hash: tx !== "" ? `0x${tx.slice(2)}` : dataForTransfer?.hash,
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
      setEstimatedTime(12 * Math.floor(surpassing / 380));
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
    speedUp,
    estimatedGas,
    estimatedTime,
    status,
    statusCode,
    dataForTransfer,
    writeForTransfer,
    increaseGasPriorityFee,
  };
};

export default useTransfer;
