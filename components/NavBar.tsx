import React, { useCallback, useEffect, useState } from "react";
import { useFilesContext } from "./FileProvider";

const NavBar: React.FC = () => {
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

  const [isOpen, setOpen] = useState(false);

  const keyBindingsFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFileNameInput("");
      } else if (e.key === "." && e.ctrlKey) {
        setOpen((prevState) => {
          return !prevState;
        });
      } else if (e.ctrlKey && e.key === ",") {
        let switchedFile = "";
        let next = false;
        files.map((file, index) => {
          if (next) {
            switchedFile = file.fileName;
            next = false;
          }
          if (file.fileName === activeFile) {
            next = true;
            if (index === files.length - 1) {
              switchedFile = files[0].fileName;
            }
          }
          return file;
        });
        switchToFile(switchedFile);
      } else if (e.ctrlKey && e.key === ";") {
        let switchedFile = "";
        let next = false;
        files
          .slice(0)
          .reverse()
          .map((file, index) => {
            if (next) {
              switchedFile = file.fileName;
              next = false;
            }
            if (file.fileName === activeFile) {
              next = true;
              if (index === files.length - 1) {
                switchedFile = files.slice(0).reverse()[0].fileName;
              }
            }
            return file;
          });
        switchToFile(switchedFile);
      }
    },
    [files, activeFile]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, [files, activeFile]);

  const [fileNameInput, setFileNameInput] = useState("");
  const [fileNameInputValue, setFileNameInputValue] = useState("");

  const sideBarClass = "sideBar" + (isOpen ? " visible" : "");
  const hamButtonClass = "openSideBar" + (isOpen ? " translateButton" : "");

  return (
    <>
      <div className="topBar">
        {tabbedFiles?.map((file, index) => {
          const divClass =
            "tab " +
            (file.fileName === activeFile ? " activeTab" : "") +
            (index === 0 ? " firstTab" : "");
          return (
            <div
              id="fileContainer"
              className={divClass}
              key={file.fileName + "tab"}
              onClick={() => {
                switchToFile(file.fileName);
              }}
            >
              {file.fileName}
            </div>
          );
        })}
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
                    addToTabs(file.fileName);
                    // removeFile(file.fileName);
                    // switchToFile(
                    //   files[files.length > 2 ? files.length - 2 : 0].fileName
                    // );
                    // localStorage.removeItem(file.fileName);
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
