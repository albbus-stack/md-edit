import { FC, useState } from "react";

interface Props {
  isModified: boolean;
}

const NavBar: FC<Props> = ({ isModified }) => {
  const [fileName, setFileName] = useState(() => {
    let filename = "";
    if (typeof window !== "undefined") {
      filename = localStorage.getItem("currentFile") ?? "";
    }
    return filename;
  });

  const [files, setFiles] = useState(() => {
    let files: any[] = [];
    if (typeof window !== "undefined") {
      let keys = Object.keys(localStorage);
      let i = keys.length;
      while (i--) {
        if (keys[i].match(".+.md")) {
          files.push({
            name: keys[i],
            value: localStorage.getItem(keys[i]),
          });
        }
      }
    }
    return files;
  });

  const [isOpen, setOpen] = useState(false);

  const sideBarClass = "sideBar" + (isOpen ? " visible" : "");
  const hamButtonClass = "openSideBar" + (isOpen ? " translateButton" : "");

  return (
    <>
      <div className="topBar">
        <div className="italic">{fileName}</div>
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
          <div className="row">
            <button
              className="editFileNameButton"
              onClick={() => {
                // setFileNameInput("edit");
              }}
            >
              ✏️
            </button>
            <button
              className="newFileButton"
              onClick={() => {
                // setFileNameInput("new");
              }}
            >
              +
            </button>
          </div>
          {files.map((file) => {
            const divClass =
              "row filename" + (file.name === fileName ? " selected" : "");
            return (
              <div
                className={divClass}
                key={file.name}
                onClick={() => {
                  // This setFilename requires a useReducer to re-render the editor on this change.
                }}
              >
                {file.name}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavBar;
