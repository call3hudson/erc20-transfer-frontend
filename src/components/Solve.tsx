import React, { useEffect, useState } from "react";
import { ButtonWithLoader, ListBox } from "@/components";

import { useSolve } from "@/hooks";

import { Open_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});
const choices = ["Rock", "Paper", "Scissor", "Lizard", "Spock"];

export default function Solve() {
  const [choice, setChoice] = useState(0);
  const [contractAddress, setContractAddress] = useState("");
  const [saltNumber, setSaltNumber] = useState(0);

  const { loading, writeForSolve } = useSolve({
    contractAddress,
    choice,
    saltNumber,
  });

  const onSelectionChanged = (sel: number) => {
    setChoice(sel);
  };

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "solve":
        writeForSolve?.();
        return;
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;
    switch (e.currentTarget.name) {
      case "contractaddress":
        setContractAddress(e.currentTarget.value);
        break;
      case "salt":
        setSaltNumber(Math.floor(Number(e.currentTarget.value)));
        break;
    }
  };

  return (
    <div className={opensans.className}>
      <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        Contract Address
      </p>
      <input
        type="text"
        value={contractAddress}
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Contract address (ex; 0x2c...)"
        name="contractaddress"
        onChange={onChangeHandler}
      />
      <p className="mt-4 mb-2 text-[11px] text-gray-500 dark:text-gray-400">
        Confirm your choice
      </p>
      <ListBox choices={choices} onSelectionChanged={onSelectionChanged} />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        Confirm your PIN
      </p>
      <input
        type="number"
        min="0"
        value={saltNumber}
        name="salt"
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Salt number (ex; 3924)"
        onChange={onChangeHandler}
      />
      <div className="mt-4 w-full">
        <ButtonWithLoader
          title={"Solve"}
          loading={loading}
          onClick={onClickHandler}
          className="w-full m-auto text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          name="solve"
          disabled={writeForSolve === undefined}
        />
      </div>
    </div>
  );
}
