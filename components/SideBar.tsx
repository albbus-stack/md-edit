import { useCallback, useEffect, useState } from "react";
import useResize from "../lib/useResize";
import { useFilesContext } from "./FileProvider";

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileNameInput: string;
  setFileNameInput: React.Dispatch<React.SetStateAction<string>>;
  fileNameInputValue: string;
  setFileNameInputValue: React.Dispatch<React.SetStateAction<string>>;
  themeEditorOpen: boolean;
  setThemeEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<Props> = ({
  isOpen,
  setOpen,
  fileNameInput,
  setFileNameInput,
  fileNameInputValue,
  setFileNameInputValue,
  themeEditorOpen,
  setThemeEditorOpen,
}) => {
  const {
    activeFile,
    files,
    addNewFile,
    removeFile,
    renameFile,
    switchToFile,
    addToTabs,
  } = useFilesContext();

  const { width, enableResize } = useResize({
    minWidth: 200,
    maxWidth: window.innerWidth - 200,
  });

  const keyBindingsFunction = useCallback((e: KeyboardEvent) => {
    if (e.key === "." && e.ctrlKey) {
      setOpen((prevState) => {
        return !prevState;
      });
    } else if (e.key === "Escape") {
      setFileNameInput("");
      setFileNameInputValue("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, []);

  const sideBarClass = "sideBar" + (isOpen ? " visible" : "");

  return (
    <>
      <div className={sideBarClass} style={{ width: width }}>
        <button
          className="openSideBar"
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          ☰
        </button>
        <div className="sideBarHandle" onMouseDown={enableResize}></div>
        <div className="row h-1 controls">
          {fileNameInput === "" ? (
            <>
              <button
                className="editFileNameButton"
                onClick={() => {
                  setFileNameInputValue(activeFile ?? "");
                  setFileNameInput("edit");
                }}
              >
                ✏️
              </button>
              <button
                className="newFileButton"
                onClick={() => {
                  setFileNameInputValue(".md");
                  setFileNameInput("new");
                }}
              >
                &#65291;
              </button>

              <button
                className="themeButton"
                onClick={() => {
                  setThemeEditorOpen((prevState) => {
                    return !prevState;
                  });
                }}
              >
                &#127912;
              </button>
            </>
          ) : fileNameInput.includes("edit") ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                renameFile(activeFile, fileNameInputValue);
                switchToFile(fileNameInputValue);
                setFileNameInput("");
                setFileNameInputValue("");
                if (fileNameInput === "edit fast") {
                  setOpen(false);
                }
              }}
            >
              <input
                autoFocus
                type="text"
                name="fileName"
                value={fileNameInputValue}
                onChange={(e) => {
                  setFileNameInputValue(e.target.value);
                }}
              />
              <input type="submit" value="✓" />
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = fileNameInputValue;
                addNewFile(input);
                addToTabs(input);
                switchToFile(input);
                setFileNameInput("");
                setFileNameInputValue("");
                if (fileNameInput === "new fast") {
                  setOpen(false);
                }
              }}
            >
              <input
                autoFocus
                type="text"
                name="fileName"
                value={fileNameInputValue}
                onFocus={(e) => {
                  e.target.selectionEnd = e.target.selectionStart = 0;
                }}
                onChange={(e) => {
                  setFileNameInputValue(e.target.value);
                }}
              />
              <input type="submit" value="✓" />
            </form>
          )}
        </div>
        {files.map((file) => {
          const divClass =
            "row filename relative" +
            (file.fileName === activeFile ? " selected" : "");
          return (
            <div
              id="fileContainer"
              className={divClass}
              key={file.fileName}
              onClick={() => {
                addToTabs(file.fileName);
                switchToFile(file.fileName);
              }}
            >
              {file.fileName}
              <button
                className="deleteButton"
                key={file.fileName + "delete"}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.fileName);
                  localStorage.removeItem(file.fileName);
                }}
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideBar;
