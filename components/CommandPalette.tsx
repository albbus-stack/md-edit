import { useCallback, useEffect, useState } from "react";
import searchProvider, { Suggestion } from "../lib/searchProvider";
import { Actions, useFilesContext } from "./FileProvider";

interface Props {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileNameInput: string;
  setFileNameInput: React.Dispatch<React.SetStateAction<string>>;
  fileNameInputValue: string;
  setFileNameInputValue: React.Dispatch<React.SetStateAction<string>>;
  themeEditorOpen: boolean;
  setThemeEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommandPalette: React.FC<Props> = ({
  isSidebarOpen,
  setSidebarOpen,
  fileNameInput,
  setFileNameInput,
  fileNameInputValue,
  setFileNameInputValue,
  themeEditorOpen,
  setThemeEditorOpen,
}) => {
  const { activeFile, executeDispatch } = useFilesContext();

  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [toBeSelected, setToBeSelected] = useState(true);
  const [isSecondInputOpen, setSecondInputOpen] = useState(false);
  const [paletteInput, setPaletteInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSubmit = (e?: any) => {
    if (e) {
      e.preventDefault();
    }
    if (searchSuggestions[selectedIndex].action !== undefined) {
      let secondInputType: string = executeDispatch(
        searchSuggestions[selectedIndex].action ?? Actions.SWITCH_TO_FILE,
        activeFile
      );

      if (secondInputType !== "") {
        setSidebarOpen(true);
        if (secondInputType === "new fast") {
          setFileNameInputValue(".md");
        } else if (secondInputType === "edit fast") {
          setFileNameInputValue(activeFile ?? "");
        }
        setFileNameInput(secondInputType);
      }
    } else if (searchSuggestions[selectedIndex].value == "Open theme editor") {
      setThemeEditorOpen((prevState) => !prevState);
    }
    setPaletteOpen((prevState) => {
      return !prevState;
    });
  };

  const keyBindingsFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ":") {
        setPaletteOpen((prevState) => {
          return !prevState;
        });
      } else if (isPaletteOpen && e.keyCode === 38) {
        setSelectedIndex((prevState) => {
          return (
            (((prevState - 1) % searchSuggestions.length) +
              searchSuggestions.length) %
            searchSuggestions.length
          );
        });
      } else if (isPaletteOpen && e.keyCode === 40) {
        setSelectedIndex((prevState) => {
          return (prevState + 1) % searchSuggestions.length;
        });
      } else if (e.ctrlKey && e.key === "*") {
        setSidebarOpen(true);
        setFileNameInput("add");
        setFileNameInputValue(".md");
      } else if (e.ctrlKey && e.key === "/") {
        executeDispatch(Actions.REMOVE_FILE, activeFile);
      }
    },
    [isPaletteOpen, setSelectedIndex, searchSuggestions]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    if (!isPaletteOpen) {
      setToBeSelected(true);
    }

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, [isPaletteOpen, setSelectedIndex, searchSuggestions]);

  useEffect(() => {
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            ref={(input) => {
              if (input && isPaletteOpen) {
                input.focus();
                if (toBeSelected) {
                  input.select();
                  setToBeSelected(false);
                }
              }
            }}
            type="text"
            name="palette"
            value={paletteInput}
            onChange={(e) => {
              setPaletteInput(e.target.value);
            }}
          />
        </form>
      </div>
      <div
        className="searchSuggestions"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {searchSuggestions.map((suggestion, index) => {
          return (
            <div
              className={
                "suggestion" + (index === selectedIndex ? " selected" : "")
              }
              key={suggestion.value}
              onClick={() => handleSubmit()}
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
