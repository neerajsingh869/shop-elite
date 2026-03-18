import { Search, X } from "lucide-react";

interface SearchModalProps {
  setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchModal({ setShowSearchModal }: SearchModalProps) {
  return (
    <div className="fixed inset-0 bg-zinc-950/50 z-50">
      <div className="w-full py-8 px-4 md:py-16 md:px-10 bg-zinc-950 flex justify-center items-center border-b border-b-zinc-800">
        <div className="border-2 bg-zinc-800 py-3.5 pl-4 border-zinc-800 border-r-0 rounded-l-xl">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="border-2 bg-zinc-800 border-zinc-800 w-full py-3 px-4 border-x-0 outline-0"
        />
        <div className="border-2 bg-zinc-800 py-3.5 pr-4 border-zinc-800 border-l-0 rounded-r-xl">
          <X size={20} className="cursor-pointer" onClick={() => setShowSearchModal(false)} />
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
