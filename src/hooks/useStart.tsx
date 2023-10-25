import React, { useState, useMemo } from "react";
import { useNetwork, useWalletClient, useContractRead } from "wagmi";
import { readContract, waitForTransaction } from "@wagmi/core";
import { RPS, Hasher } from "@/abis";
import { RPSBytecode } from "@/bytecodes";

type Props = {
  choice: number;
  userAddress: string;
  saltNumber: number;
  ether: number;
};

const useStart = ({ choice, userAddress, saltNumber, ether }: Props) => {
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(false);

  const { data: walletClient } = useWalletClient({ chainId: chain?.id });
  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_HASHER_ADDRESS
      ? `0x${process.env.NEXT_PUBLIC_HASHER_ADDRESS.slice(2)}`
      : "0x",
    abi: Hasher,
    functionName: "hash",
    args: [choice + 1, BigInt(saltNumber)],
  });

  const writeForPlay: (() => Promise<string | null>) | undefined =
    useMemo(() => {
      if (
        data === undefined ||
        isError ||
        isLoading ||
        ether == 0 ||
        userAddress.length != 42 ||
        !userAddress.startsWith("0x")
      )
        return undefined;
      return async () => {
        setLoading(true);
        try {
          const hash = await walletClient?.deployContract({
            abi: RPS,
            bytecode: `0x${RPSBytecode}`,
            args: [data, `0x${userAddress.slice(2)}`],
            value: BigInt(ether * 1e18),
          });

          if (hash !== undefined) {
            const transactionResult = await waitForTransaction({ hash });
            setLoading(false);
            return transactionResult.contractAddress;
          }

          setLoading(false);
        } catch {
          setLoading(false);
        }

        return null;
      };
    }, [data, isError, isLoading, ether, userAddress, walletClient]);

  return { loading, writeForPlay };
};

export default useStart;
