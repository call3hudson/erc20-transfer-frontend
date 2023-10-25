import React, { useEffect, useState } from "react";
import { ButtonWithLoader, ListBox } from "@/components";

import { useCheckATimeout, useCheckBTimeout } from "@/hooks";

import { Open_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});
const choices = ["Rock", "Paper", "Scissor", "Lizard", "Spock"];

export default function Timeout() {
  const [contractAddress, setContractAddress] = useState("");

  const { loading: loadingForATimeout, writeForATimeout } = useCheckATimeout({
    contractAddress,
  });

  const { loading: loadingForBTimeout, writeForBTimeout } = useCheckBTimeout({
    contractAddress,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;
    switch (e.currentTarget.name) {
      case "contractaddress":
        setContractAddress(e.currentTarget.value);
        break;
    }
  };

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "checkato":
        writeForATimeout?.();
        return;
      case "checkbto":
        writeForBTimeout?.();
        return;
    }
  };

  return (
    <div className={opensans.className}>
      <p className="mt-2 mb-2 text-[11px] text-gray-500 dark:text-gray-400">
        Contract Address
      </p>
      <input
        type="text"
        value={contractAddress}
        className="bg-gray-50 mt-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Contract address (ex; 0x2c...)"
        name="contractaddress"
        onChange={onChangeHandler}
      />
      <div className="flex w-full mt-4 space-x-2">
        <ButtonWithLoader
          title={"Check A T/O"}
          loading={loadingForATimeout}
          onClick={onClickHandler}
          className="w-full m-auto text-white bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          name="checkato"
          disabled={writeForATimeout === undefined}
        />
        <ButtonWithLoader
          title={"Check B T/O"}
          loading={loadingForBTimeout}
          onClick={onClickHandler}
          className="w-full m-auto text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          name="checkbto"
          disabled={writeForBTimeout === undefined}
        />
      </div>
    </div>
  );
}
