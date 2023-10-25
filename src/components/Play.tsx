import React, { useEffect, useState } from "react";
import { ButtonWithLoader, ListBox } from "@/components";

import { usePlay } from "@/hooks";

import { Open_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});
const choices = ["Rock", "Paper", "Scissor", "Lizard", "Spock"];

export default function Play() {
  const [choice, setChoice] = useState(0);
  const [contractAddress, setContractAddress] = useState("");
  const { loading, writeForPlay } = usePlay({ contractAddress, choice });

  const onSelectionChanged = (sel: number) => {
    setChoice(sel);
  };

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "play":
        writeForPlay?.();
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
        className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Contract address (ex; 0x2c...)"
        name="contractaddress"
        onChange={onChangeHandler}
      />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        Your choice
      </p>
      <ListBox choices={choices} onSelectionChanged={onSelectionChanged} />
      <div className="mt-4 w-full">
        <ButtonWithLoader
          title={"Play"}
          loading={loading}
          onClick={onClickHandler}
          className="w-full mt-2 m-auto text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          name="play"
          disabled={writeForPlay === undefined}
        />
      </div>
    </div>
  );
}
