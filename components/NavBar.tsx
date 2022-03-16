import React, { useCallback, useEffect, useState } from "react";
import { useFilesContext } from "./FileProvider";
import SideBar from "./SideBar";

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
    removeFromTabs,
  } = useFilesContext();

  const [isOpen, setOpen] = useState(false);

  const keyBindingsFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "." && e.ctrlKey) {
        setOpen((prevState) => {
          return !prevState;
        });
      } else if (e.ctrlKey && e.key === ",") {
        let switchedFile = "";
        let next = false;
        tabbedFiles.map((file, index) => {
          if (next) {
            switchedFile = file.fileName;
            next = false;
          }
          if (file.fileName === activeFile) {
            next = true;
            if (index === tabbedFiles.length - 1) {
              switchedFile = tabbedFiles[0].fileName;
            }
          }
          return file;
        });
        switchToFile(switchedFile);
      } else if (e.ctrlKey && e.key === ";") {
        let switchedFile = "";
        let next = false;
        tabbedFiles
          .slice(0)
          .reverse()
          .map((file, index) => {
            if (next) {
              switchedFile = file.fileName;
              next = false;
            }
            if (file.fileName === activeFile) {
              next = true;
              if (index === tabbedFiles.length - 1) {
                switchedFile = tabbedFiles.slice(0).reverse()[0].fileName;
              }
            }
            return file;
          });
        switchToFile(switchedFile);
      }
    },
    [files, tabbedFiles, activeFile]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, [files, tabbedFiles, activeFile]);

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
              <button
                className="removeFromTabsButton"
                key={file.fileName + "removeFromTabs"}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromTabs(file.fileName);
                  if (file.fileName === activeFile) {
                    let switchIndex: number = tabbedFiles.length - 1;
                    for (let i = 0; i < tabbedFiles.length; i++) {
                      if (
                        tabbedFiles[i].fileName === file.fileName &&
                        i === tabbedFiles.length - 1
                      )
                        switchIndex = tabbedFiles.length - 2;
                    }
                    switchToFile(tabbedFiles[switchIndex].fileName);
                  }
                }}
              >
                &#10005;
              </button>
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
        <SideBar isOpen={isOpen} />
      </div>
    </>
  );
};

export default NavBar;
