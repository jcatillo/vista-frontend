import { Search } from "lucide-react";

export function MarketplaceSearch() {
  return (
    <div className="shadow-soft mx-auto flex w-full max-w-3xl items-center rounded-full border border-gray-200 bg-white p-2 transition-shadow hover:shadow-md">
      {/* Where */}
      <div className="flex-1 cursor-pointer rounded-full border-r border-gray-200 px-6 py-2 hover:bg-gray-50">
        <div className="text-xs font-bold text-gray-800">Where</div>
        <div className="truncate text-sm text-gray-500">
          Search destinations
        </div>
      </div>

      {/* When */}
      <div className="flex-1 cursor-pointer rounded-full border-r border-gray-200 px-6 py-2 hover:bg-gray-50">
        <div className="text-xs font-bold text-gray-800">When</div>
        <div className="truncate text-sm text-gray-500">Add dates</div>
      </div>

      {/* Who */}
      <div className="flex flex-1 cursor-pointer items-center justify-between rounded-full pr-2 pl-6 hover:bg-gray-50">
        <div className="flex flex-col">
          <div className="text-xs font-bold text-gray-800">Who</div>
          <div className="truncate text-sm text-gray-500">Add guests</div>
        </div>

        {/* Search Button */}
        <button className="bg-vista-primary hover:bg-opacity-90 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors">
          <Search className="h-4 w-4 font-bold" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
