import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import SearchBarModal from "./SearchBarModal";

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      } else if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    }

    // attach global event listener to handle search modal
    document.addEventListener("keydown", handleKeyDown);

    // remove event handler when component unmounts
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {isOpen && <SearchBarModal setIsOpen={setIsOpen} />}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md transition-colors duration-100 hover:text-yellow-400 hover:bg-yellow-600/15 cursor-pointer p-1.5"
      >
        <Search size={20} />
      </button>
    </>
  );
}

export default SearchBar;
