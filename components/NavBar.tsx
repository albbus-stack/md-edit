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
    [files, activeFile]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyBindingsFunction, false);

    return () => {
      document.removeEventListener("keydown", keyBindingsFunction, false);
    };
  }, [files, activeFile]);

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
        <SideBar isOpen={isOpen} />
      </div>
    </>
  );
};

export default NavBar;
