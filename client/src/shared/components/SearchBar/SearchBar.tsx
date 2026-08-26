import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import SearchBarModal from "./SearchBarModal";

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    }

    // attach global event listener to handle search modal
    document.addEventListener("keydown", handleKeyDown);

    // remove event handler when component unmounts
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /*
    Escape and the body scroll lock used to live here. Both moved into Modal so
    all three overlays behave the same way instead of each doing its own thing.
  */

  return (
    <>
      {/* only mounted while open so the search hook doesn't run on every page */}
      {isOpen && <SearchBarModal setIsOpen={setIsOpen} />}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search products"
        className="rounded-md transition-colors duration-100 hover:text-yellow-400 hover:bg-yellow-600/15 cursor-pointer p-1.5"
      >
        <Search size={20} aria-hidden="true" />
      </button>
    </>
  );
}

export default SearchBar;
