import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  tabs: Tab[];
};

type Tab = {
  tabTitle: string;
  tabContent: React.ReactNode;
};

export default function TabWidget({ tabs }: Props) {
  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full pl-5 pr-5 rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "focus:outline-none",
                  selected
                    ? "bg-white shadow"
                    : "text-grey-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab.tabTitle}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              {tab.tabContent}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
