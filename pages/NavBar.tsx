import React, { FC, useCallback, useEffect, useState } from "react";
import { useFilesContext } from "./fileProvider";

interface Props {
  isModified: boolean;
}

const NavBar: FC<Props> = ({ isModified }) => {
  const {
    activeFile,
    files,
    addNewFile,
    removeFile,
    renameFile,
    switchToFile,
  } = useFilesContext();

  const keyBindingsFunction = useCallback((e) => {
    if (e.key === "Escape") {
      setFileNameInput("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, []);

  const [isOpen, setOpen] = useState(false);

  const [fileNameInput, setFileNameInput] = useState("");
  const [fileNameInputValue, setFileNameInputValue] = useState("");

  const sideBarClass = "sideBar" + (isOpen ? " visible" : "");
  const hamButtonClass = "openSideBar" + (isOpen ? " translateButton" : "");

  return (
    <>
      <div className="topBar">
        <div className="italic">{activeFile}</div>
        <span>{isModified ? "•" : ""}</span>
        <div className="spacer"></div>
        <button
          className={hamButtonClass}
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          ☰
        </button>
        <div className={sideBarClass}>
          <div className="row h-1">
            {fileNameInput === "" ? (
              <>
                <button
                  className="editFileNameButton"
                  onClick={() => {
                    setFileNameInput("edit");
                    setFileNameInputValue(activeFile ?? "");
                  }}
                >
                  ✏️
                </button>
                <button
                  className="newFileButton"
                  onClick={() => {
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
                  switchToFile(input);
                  localStorage.setItem(input, "gg");
                  localStorage.setItem("currentFile", input);
                  setFileNameInput("");
                }}
              >
                <input
                  type="text"
                  name="fileName"
                  value={fileNameInputValue}
                  onChange={(e) => {
                    setFileNameInputValue(e.target.value);
                  }}
                />
                <input type="submit" value="✓" />
              </form>
            )}
          </div>
          {files?.map((file) => {
            const divClass =
              "row filename" +
              (file.fileName === activeFile ? " selected" : "");
            return (
              <div
                className={divClass}
                key={file.fileName}
                onClick={() => {
                  switchToFile(file.fileName);
                }}
              >
                {file.fileName}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavBar;
