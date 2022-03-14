import React, { useCallback, useEffect, useState } from "react";
import { useFilesContext } from "./FileProvider";

interface Props {
  isModified: boolean;
}

const NavBar: React.FC<Props> = ({ isModified }) => {
  const {
    activeFile,
    files,
    addNewFile,
    removeFile,
    renameFile,
    switchToFile,
  } = useFilesContext();

  const [isOpen, setOpen] = useState(false);

  const keyBindingsFunction = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setFileNameInput("");
      } else if (e.key === "." && e.ctrlKey === true) {
        setOpen((prevState) => {
          return !prevState;
        });
      } else if (e.key === "," && e.ctrlKey === true) {
        let switchedFile = "";
        let active = localStorage.getItem("currentFile");
        let next = false;
        files.map((file, index) => {
          if (next) {
            switchedFile = file.fileName;
            next = false;
          }
          if (file.fileName === active) {
            next = true;
            if (index === files.length - 1) {
              switchedFile = files[0].fileName;
            }
          }
        });
        switchToFile(switchedFile);
      }
    },
    [isOpen, files, activeFile]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, []);

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
          {files?.map((file) => {
            const divClass =
              "row filename relative" +
              (file.fileName === activeFile ? " selected" : "");
            return (
              <div
                id="fileContainer"
                className={divClass}
                key={file.fileName}
                onClick={() => {
                  switchToFile(file.fileName);
                }}
              >
                {file.fileName}
                <button
                  className="deleteButton"
                  key={file.fileName}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.fileName);
                    switchToFile(
                      files[files.length > 2 ? files.length - 2 : 0].fileName
                    );
                    localStorage.removeItem(file.fileName);
                  }}
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavBar;
