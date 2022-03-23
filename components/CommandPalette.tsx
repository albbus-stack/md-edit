import { useCallback, useEffect, useState } from "react";
import searchProvider, { Suggestion } from "../lib/searchProvider";

const CommandPalette: React.FC = () => {
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [paletteInput, setPaletteInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Suggestion[]>([]);

  const keyBindingsFunction = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === ":") {
      setPaletteOpen((prevState) => {
        return !prevState;
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, []);

  useEffect(() => {
    //console.log(searchProvider({ query: paletteInput }).suggestions);
    setSearchSuggestions(searchProvider({ query: paletteInput }).suggestions);
  }, [paletteInput]);

  const paletteWrapperClass =
    "paletteWrapper" + (!isPaletteOpen ? " opacity-0" : "");

  return (
    <div
      className={paletteWrapperClass}
      onClick={() => {
        setPaletteOpen(false);
      }}
    >
      <div
        className="palette"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            ref={(input) => input && isPaletteOpen && input.focus()}
            type="text"
            name="palette"
            value={paletteInput}
            onChange={(e) => {
              setPaletteInput(e.target.value);
            }}
          />
          {/* <input type="submit" className="paletteSubmit" value="✓" /> */}
        </form>
      </div>
      <div
        className="searchSuggestions"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {searchSuggestions.map((suggestion) => {
          return (
            <div
              className="suggestion"
              key={suggestion.value} /* onClick={suggestion.action} */
            >
              {suggestion.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommandPalette;
