import React, { useEffect, useReducer, useState } from "react";
import {
  useToken,
  useBalance,
  useAccount,
  useFeeData,
  useNetwork,
} from "wagmi";
import { Spinner, ButtonWithLoader } from "@/components";
import { useTransfer } from "@/hooks";

import {
  Actions,
  reducer,
  defaultState,
  validateAddress,
  validateNumber,
  classNames,
} from "@/utils";

import { Open_Sans } from "next/font/google";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});

export default function Start() {
  const [readOnly, setReadOnly] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { address, isConnected: _isConnected } = useAccount();

  const [chain, setChain] = useState<
    (any & { unsupported?: boolean | undefined }) | undefined
  >(undefined);
  const { chain: _chain } = useNetwork();

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);

  useEffect(() => {
    setChain(_chain);
  }, [_chain]);

  useEffect(() => {
    setReadOnly(
      !isConnected ||
        chain === undefined ||
        chain.unsupported == true ||
        chain.id != Number(process.env.NEXT_PUBLIC_CHAIN_ID)
    );
  }, [isConnected, chain]);

  const [state, dispatch] = useReducer(reducer, defaultState);

  const { data, isError, isLoading } = useToken({
    address: validateAddress(state.token.address).valid
      ? `0x${state.token.address.slice(2)}`
      : "0x",
  });
  const {
    data: dataForBalance,
    isError: isErrorForBalance,
    isLoading: isLoadingForBalance,
  } = useBalance({
    address: address,
    token: validateAddress(state.token.address).valid
      ? `0x${state.token.address.slice(2)}`
      : "0x",
  });
  const {
    loading,
    speedUp,
    estimatedGas,
    estimatedTime,
    status,
    statusCode,
    dataForTransfer,
    writeForTransfer,
    increaseGasPriorityFee,
  } = useTransfer({
    contractAddress: state.token.address,
    userAddress: state.user.address,
    amount: BigInt(
      state.transferAmount.amount * Math.pow(10, state.token.decimal)
    ),
    gasFee: BigInt(state.gasFee.amount),
    priorityFee: BigInt(state.gasFee.amount - state.gasFee.baseFee),
    tx: state.tx.txHash,
  });
  const { data: dataForGas } = useFeeData({
    watch: true,
    formatUnits: "gwei",
    scopeKey: `useFeeData`,
  });

  useEffect(() => {
    dispatch({
      type: Actions.RESET,
      payload: {},
    });

    window.addEventListener("storage", (e) => {
      dispatch({
        type: Actions.RESET,
        payload: {},
      });
    });
  }, []);

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "start":
        writeForTransfer?.();
        return;
      case "setgas":
        increaseGasPriorityFee(
          BigInt(state.gasFee.amount - state.gasFee.baseFee)
        );
        return;
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;
    switch (e.currentTarget.name) {
      case "token": {
        const { valid, error } = validateAddress(e.currentTarget.value);
        dispatch({
          type: Actions.CA_UPDATE,
          payload: {
            address: e.currentTarget.value,
            name: "-",
            symbol: "-",
            decimal: 0,
            valid: valid,
            loading: false,
            error: error,
          },
        });
        break;
      }
      case "user": {
        const { valid, error } = validateAddress(e.currentTarget.value);
        dispatch({
          type: Actions.EOA_UPDATE,
          payload: {
            ...state.user,
            address: e.currentTarget.value,
            valid: valid,
            error: error,
          },
        });
        break;
      }
      case "amount": {
        const { valid, error } = validateNumber(Number(e.currentTarget.value));
        dispatch({
          type: Actions.AMOUNT_UPDATE,
          payload: {
            amount: e.currentTarget.value,
            valid: valid,
            error: error,
          },
        });
        break;
      }
      case "gas": {
        dispatch({
          type: Actions.GAS_UPDATE,
          payload: {
            ...state.gasFee,
            amount: Number(e.currentTarget.value),
          },
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;
    if (readOnly) {
      return dispatch({
        type: Actions.CA_UPDATE,
        payload: {
          ...state.token,
          valid: false,
          loading: false,
          error: "Please connect wallet first",
        },
      });
    }
    if (isError) {
      return dispatch({
        type: Actions.CA_UPDATE,
        payload: {
          ...state.token,
          valid: false,
          loading: false,
          error: "Not a valid ERC20",
        },
      });
    }
    if (isLoading == true) {
      return dispatch({
        type: Actions.CA_UPDATE,
        payload: {
          ...state.token,
          loading: true,
          valid: true,
          error: "Checking for validation",
        },
      });
    }
    dispatch({
      type: Actions.CA_UPDATE,
      payload: {
        ...state.token,
        name: data?.name,
        symbol: data?.symbol,
        decimal: data?.decimals,
        holdings: "0",
        formatted: "0",
        loading: false,
        valid: true,
        error: "",
      },
    });
  }, [data, isError, isLoading, readOnly]);

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;

    if (isErrorForBalance)
      return dispatch({
        type: Actions.EOA_UPDATE,
        payload: {
          ...state.user,
          loading: false,
          holdings: "0",
          formatted: "0",
          valid: false,
        },
      });
    if (isLoadingForBalance)
      return dispatch({
        type: Actions.EOA_UPDATE,
        payload: {
          ...state.user,
          loading: true,
        },
      });
    dispatch({
      type: Actions.EOA_UPDATE,
      payload: {
        ...state.user,
        loading: false,
        holdings: dataForBalance?.value.toString(),
        formatted: dataForBalance?.formatted,
      },
    });
  }, [dataForBalance, isErrorForBalance, isLoadingForBalance]);

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;
    if (dataForTransfer === undefined) return;

    dispatch({
      type: Actions.TX_UPDATE,
      payload: {
        ...state.tx,
        txHash: dataForTransfer.hash,
      },
    });
  }, [dataForTransfer]);

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;

    dispatch({
      type: Actions.TX_UPDATE,
      payload: {
        ...state.tx,
        status: status,
        statusCode: statusCode,
        estimatedGas: estimatedGas,
        estimatedTime: estimatedTime,
        loading: loading,
      },
    });
  }, [status, statusCode, estimatedTime, estimatedGas, loading]);

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;
    if (dataForGas === undefined) return;
    let amount = state.gasFee.amount;
    let baseFee = Number(dataForGas?.gasPrice);
    let maxFeePerGas = Number(dataForGas?.maxFeePerGas);
    let maxPriorityPerGas = Number(dataForGas?.maxPriorityFeePerGas);
    if (amount < baseFee) amount = baseFee;
    if (amount > maxFeePerGas) amount = maxFeePerGas;

    dispatch({
      type: Actions.GAS_UPDATE,
      payload: {
        amount: amount,
        baseFee: baseFee,
        maxFeePerGas: maxFeePerGas,
        maxPriorityPerGas: maxPriorityPerGas,
      },
    });
  }, [dataForGas]);

  return (
    <div className={opensans.className}>
      <div className="mt-10 mb-10">
        {/* Token selection */}
        <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
          Token address
        </p>
        <input
          type="text"
          value={state.token.address}
          name="token"
          className={classNames(
            "bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            !state.token.valid ? "border-red" : ""
          )}
          placeholder="Token address (ex; 0x2c...)"
          onChange={onChangeHandler}
          readOnly={readOnly}
        />
        {!state.token.valid ? (
          <p className="mt-1 text-[11px] text-red">{state.token.error}</p>
        ) : state.token.loading ? (
          <p className="mt-1 text-[11px] text-green">{state.token.error}</p>
        ) : (
          <></>
        )}

        {/* Token Information */}
        <div className="grid grid-cols-2 gap-1">
          <div>
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Token Name
            </p>
            <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
              {state.token.loading ? <Spinner /> : state.token.name}
            </p>
          </div>
          <div>
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Token Symbol
            </p>
            <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
              {state.token.loading ? <Spinner /> : state.token.symbol}
            </p>
          </div>
          <div>
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Token Decimal
            </p>
            <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
              {state.token.loading ? (
                <Spinner />
              ) : state.token.decimal == 0 ? (
                "-"
              ) : (
                state.token.decimal
              )}
            </p>
          </div>
          <div>
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Available
            </p>
            <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
              {state.token.loading || state.user.loading ? (
                <Spinner />
              ) : Number(state.user.holdings) == 0 ? (
                "-"
              ) : (
                state.user.formatted
              )}
            </p>
          </div>
        </div>

        {state.token.valid && state.user.formatted != "0" ? (
          <>
            {/* Token transfer */}
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Target user address
            </p>
            <input
              type="text"
              value={state.user.address}
              name="user"
              className={classNames(
                "bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                !state.user.valid ? "border-red" : ""
              )}
              placeholder="User address (ex; 0x2c...)"
              onChange={onChangeHandler}
              readOnly={readOnly}
            />
            {!state.user.valid ? (
              <p className="mt-1 text-[11px] text-red">{state.user.error}</p>
            ) : (
              <></>
            )}
            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
              Transfer amount
            </p>
            <input
              type="number"
              min="0"
              max={Number(state.user.formatted)}
              value={state.transferAmount.amount}
              name="amount"
              className={classNames(
                "bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                !state.transferAmount.valid ? "border-red" : ""
              )}
              placeholder="Transfer amount (ex; 0.5)"
              onChange={onChangeHandler}
              readOnly={readOnly}
            />
            {!state.transferAmount.valid ? (
              <p className="mt-1 text-[11px] text-red">
                {state.transferAmount.error}
              </p>
            ) : (
              <></>
            )}
            <div className="w-full mt-4">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Status
                <span
                  className={classNames(
                    `text-[11px] text-gray-500 dark:text-gray-400 float-right`,
                    state.tx.statusCode == 1
                      ? `text-skyblue dark:text-skyblue`
                      : state.tx.statusCode == 2
                      ? `text-lightblue dark:text-lightblue`
                      : state.tx.statusCode == 3
                      ? `text-red dark:text-red`
                      : state.tx.statusCode == 4
                      ? `text-orange dark:text-orange`
                      : state.tx.statusCode == -1
                      ? `text-green dark:text-green`
                      : ""
                  )}
                >
                  {`${state.tx.status}${
                    state.tx.statusCode == 2
                      ? ` (Likely in < ${state.tx.estimatedTime + 1} seconds)`
                      : ""
                  }`}
                </span>
              </p>
            </div>
            <div className="w-full mt-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Gas Fee (BaseFee + Priority Fee)
                <span className="text-[11px] text-gray-500 dark:text-gray-400 float-right">
                  {`${(state.gasFee.amount / 1e9).toFixed(2)} gwei`}
                </span>
              </p>
            </div>
            <div className="w-full mt-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Estimated Gas
                <span className="text-[11px] text-gray-500 dark:text-gray-400 float-right">
                  {`${state.tx.estimatedGas}`}
                </span>
              </p>
            </div>
            <div className="w-full mt-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Required ETH
                <span className="text-[11px] text-gray-500 dark:text-gray-400 float-right">
                  {`${(
                    (state.tx.estimatedGas * state.gasFee.amount) /
                    1e9
                  ).toFixed(2)} gwei`}
                </span>
              </p>
            </div>
            <div className="mt-1 w-full">
              <input
                id="default-range"
                type="range"
                name="gas"
                min={state.gasFee.baseFee}
                max={state.gasFee.maxFeePerGas}
                value={state.gasFee.amount}
                onChange={onChangeHandler}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-dark"
              ></input>
            </div>
            {/* Transfer */}
            <div className="mt-4 w-full">
              <ButtonWithLoader
                title={"Start"}
                onClick={onClickHandler}
                className="w-full m-auto text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                name="start"
                loading={state.tx.loading}
                disabled={
                  !(
                    state.token.valid &&
                    state.user.valid &&
                    state.user.formatted != "0"
                  ) ||
                  state.transferAmount.amount == 0 ||
                  readOnly ||
                  !writeForTransfer
                }
              />
            </div>
            {/* Increase gas fee */}
            {state.tx.statusCode == 2 ? (
              <div className="mt-4 w-full">
                <ButtonWithLoader
                  title={"Speed up"}
                  onClick={onClickHandler}
                  className="w-full m-auto text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  name="setgas"
                  disabled={readOnly}
                  loading={speedUp}
                />
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        <p
          id="helper-text-explanation"
          className="mt-4 mb-5 text-[10px] text-gray-500 dark:text-gray-400"
        >
          Please note that low gas fee would lead Tx failure. For more
          information, see the{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            docs
          </a>
          .
        </p>
      </div>
    </div>
  );
}
