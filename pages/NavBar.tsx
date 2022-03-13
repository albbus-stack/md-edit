import React, { FC, useState } from "react";
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
              <>
                <input
                  type="text"
                  name="fileName"
                  value={fileNameInputValue}
                  onChange={(e) => {
                    setFileNameInputValue(e.target.value);
                  }}
                />
                <input
                  type="button"
                  value="✓"
                  onClick={() => {
                    // This setFilename requires a useReducer to re-render the editor on this change.
                  }}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="fileName"
                  value={fileNameInputValue}
                  onChange={(e) => {
                    setFileNameInputValue(e.target.value);
                  }}
                />
                <input
                  type="button"
                  value="✓"
                  onClick={() => {
                    // This setFilename requires a useReducer to re-render the editor on this change.
                  }}
                />
              </>
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
