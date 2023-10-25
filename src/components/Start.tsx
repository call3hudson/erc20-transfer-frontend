import React, { useEffect, useState } from "react";
import { ListBox, ButtonWithLoader } from "@/components";

import { useStart } from "@/hooks";

import { Open_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

const opensans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});
const choices = ["Rock", "Paper", "Scissor", "Lizard", "Spock"];

export default function Start() {
  const [choice, setChoice] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [saltNumber, setSaltNumber] = useState(0);
  const [ether, setEther] = useState(0);
  const [deployedContract, setDeployedContract] = useState("");

  const { loading, writeForPlay } = useStart({
    choice,
    userAddress,
    saltNumber,
    ether,
  });

  const onSelectionChanged = (sel: number) => {
    setChoice(sel);
  };

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;

    switch (e.currentTarget.name) {
      case "start":
        const address = await writeForPlay?.();
        if (address !== null) setDeployedContract(address ?? "");
        return;
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget == null) return;
    switch (e.currentTarget.name) {
      case "useraddress":
        setUserAddress(e.currentTarget.value);
        break;
      case "salt":
        setSaltNumber(Math.floor(Number(e.currentTarget.value)));
        break;
      case "ether":
        setEther(Number(e.currentTarget.value));
        break;
    }
  };

  return (
    <div className={opensans.className}>
      <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        Your choice
      </p>
      <ListBox choices={choices} onSelectionChanged={onSelectionChanged} />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        Player B EOA
      </p>
      <input
        type="text"
        value={userAddress}
        name="useraddress"
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="User address (ex; 0x2c...)"
        onChange={onChangeHandler}
      />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        PIN (Must be randomized for security)
      </p>
      <input
        type="number"
        min="0"
        value={saltNumber}
        name="salt"
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="PIN number (ex; 3924)"
        onChange={onChangeHandler}
      />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        Betting ETH amount
      </p>
      <input
        type="number"
        min="0"
        value={ether}
        name="ether"
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Betting ETH (ex; 0.5)"
        onChange={onChangeHandler}
      />
      <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
        Contract deployed at:
      </p>
      <input
        type="input"
        value={deployedContract}
        className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Contract address"
        disabled
      />
      <div className="mt-4 w-full">
        <ButtonWithLoader
          title={"Start"}
          loading={loading}
          onClick={onClickHandler}
          className="w-full m-auto text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          name="start"
          disabled={writeForPlay === undefined}
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
  );
}
