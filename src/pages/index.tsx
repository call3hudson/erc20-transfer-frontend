import { Start } from "@/components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDarkMode } from "@/hooks";

export default function Home() {
  return (
    <>
      <div className="fixed top-5 right-5 z-10">
        <ConnectButton />
      </div>
      <div className="min-h-screen bg-[url('/images/download.png')] dark:bg-[url('/images/download-dark.png')] py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
        <div className="relative px-6 shadow-xl bg-gray-50 sm:max-w-lg sm:mx-auto rounded-xl sm:px-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <div className="min-w-screen mx-auto">
            <div className="divide-y divide-gray-400/50">
              <Start />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
