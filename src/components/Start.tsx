import React, { useEffect, useReducer } from "react";
import { useToken, useBalance, useAccount } from "wagmi";
import { Spinner, ButtonWithLoader } from "@/components";
import { useTransfer } from "@/hooks";

import { Open_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

enum Actions {
  CA_UPDATE = "CA_UPDATE",
  EOA_UPDATE = "EOA_UPDATE",
  AMOUNT_UPDATE = "AMOUNT_UPDATE",
}

type Action = {
  type: Actions;
  payload: any;
};

type State = {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimal: number;
    valid: boolean;
    loading: boolean;
    error: string;
  };
  user: {
    address: string;
    holdings: bigint;
    formatted: string;
    valid: boolean;
    loading: boolean;
    error: string;
  };
  transferAmount: {
    amount: number;
    valid: boolean;
    error: string;
  };
};

const defaultState: State = {
  token: {
    address: "",
    name: "-",
    symbol: "-",
    decimal: 0,
    valid: true,
    loading: false,
    error: "",
  },
  user: {
    address: "",
    holdings: BigInt(0),
    formatted: "0",
    valid: true,
    loading: false,
    error: "",
  },
  transferAmount: {
    amount: 0,
    valid: true,
    error: "",
  },
};

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.CA_UPDATE:
      return {
        ...state,
        token: payload,
      };
    case Actions.EOA_UPDATE:
      return {
        ...state,
        user: payload,
      };
    case Actions.AMOUNT_UPDATE:
      return {
        ...state,
        transferAmount: payload,
      };
    default:
      return state;
  }
};

const validateAddress = (
  address: string
): { valid: boolean; error: string } => {
  if (address === null || address === undefined || address.length == 0)
    return { valid: false, error: "Address field is empty" };
  if (!address.startsWith("0x"))
    return { valid: false, error: "Address must starts with '0x'" };
  if (address.length != 42)
    return {
      valid: false,
      error: "Address length should be 42 characters long",
    };
  return { valid: true, error: "" };
};

const validateNumber = (amount: number): { valid: boolean; error: string } => {
  if (amount === null || amount === undefined || amount == 0)
    return { valid: false, error: "Amount should be greater than 0" };
  return { valid: true, error: "" };
};

export default function Start() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { address } = useAccount();
  const { data, isError, isLoading } = useToken({
    address: validateAddress(state.token.address).valid
      ? state.token.address
      : "0x",
  });
  const {
    data: dataForBalance,
    isError: isErrorForBalance,
    isLoading: isLoadingForBalance,
  } = useBalance({
    address: address,
    token: validateAddress(state.token.address).valid
      ? state.token.address
      : "0x",
  });
  const { loading, dataForTransfer, writeForTransfer } = useTransfer({
    contractAddress: state.token.address,
    userAddress: state.user.address,
    amount: BigInt(
      state.transferAmount.amount * Math.pow(10, state.token.decimal)
    ),
  });

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "start":
        writeForTransfer?.();
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
      }
    }
  };

  useEffect(() => {
    if (validateAddress(state.token.address).valid == false) return;
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
        holdings: 0,
        formatted: "0",
        loading: false,
        valid: true,
        error: "",
      },
    });
  }, [data, isError, isLoading]);

  useEffect(() => {
    if (
      validateAddress(state.token.address).valid == false ||
      isErrorForBalance
    )
      return dispatch({
        type: Actions.EOA_UPDATE,
        payload: {
          ...state.user,
          loading: false,
          holdings: 0,
          formatted: "0",
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
        holdings: dataForBalance?.value,
        formatted: dataForBalance?.formatted,
      },
    });
  }, [dataForBalance, isErrorForBalance, isLoadingForBalance]);

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
            />
            {!state.transferAmount.valid ? (
              <p className="mt-1 text-[11px] text-red">
                {state.transferAmount.error}
              </p>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {/* Transfer */}
        <div className="mt-4 w-full">
          <ButtonWithLoader
            title={"Start"}
            onClick={onClickHandler}
            className="w-full m-auto text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            name="start"
            loading={loading}
            disabled={
              !(
                state.token.valid &&
                state.user.valid &&
                state.user.formatted != "0"
              ) ||
              state.transferAmount.amount == 0 ||
              !writeForTransfer
            }
          />
        </div>
        <p
          id="helper-text-explanation"
          className="mt-4 text-[10px] text-gray-500 dark:text-gray-400"
        >
          Please remember PIN, for more information refer{" "}
          <a
            href="https://docs.google.com/document/d/1rKFwrf8Qk1VStsqYBThcNDibDwT8_A1sXfu8YjfWL6M/edit#heading=h.8ruj1lh0x1vp"
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
