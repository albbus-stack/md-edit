import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import useResize from "../lib/useResize";
import { useFilesContext } from "./FileProvider";

const SideBar: React.FC = () => {
  const {
    activeFile,
    files,
    tabbedFiles,
    addNewFile,
    removeFile,
    renameFile,
    switchToFile,
    addToTabs,
  } = useFilesContext();

  const { width, enableResize } = useResize({ minWidth: 200 });

  const [isOpen, setOpen] = useState(false);

  const keyBindingsFunction = useCallback((e: KeyboardEvent) => {
    if (e.key === "." && e.ctrlKey) {
      setOpen((prevState) => {
        return !prevState;
      });
    } else if (e.key === "Escape") {
      setFileNameInput("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, []);

  const [fileNameInput, setFileNameInput] = useState("");
  const [fileNameInputValue, setFileNameInputValue] = useState("");

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
                +
              </button>
            </>
          ) : fileNameInput === "edit" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                renameFile(activeFile, fileNameInputValue);
                switchToFile(fileNameInputValue);
                setFileNameInput("");
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
                localStorage.setItem(input, "# " + input.toString());
                setFileNameInput("");
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
