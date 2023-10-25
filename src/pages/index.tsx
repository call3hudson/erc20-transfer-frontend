import { TabWidget, Start, Solve, Play, Timeout } from "@/components";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const tabs = [
  {
    tabTitle: "Start",
    tabContent: <Start />,
  },
  {
    tabTitle: "Play",
    tabContent: <Play />,
  },
  {
    tabTitle: "Solve",
    tabContent: <Solve />,
  },
  {
    tabTitle: "Timeout",
    tabContent: <Timeout />,
  },
];

export default function Home() {
  return (
    <>
      <div className="fixed top-5 right-5 z-10">
        <ConnectButton />
      </div>
      <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
        <div className="relative px-6 bg-[#efedec] shadow-xl sm:max-w-lg sm:mx-auto rounded-xl sm:px-10">
          <div className="min-w-screen mx-auto">
            <div className="divide-y divide-gray-400/50">
              <TabWidget tabs={tabs} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
