import React from "react";

const initialState = {
  activeFile: "",
  files: [{}],
};

function init(): any {
  let files: any[] = [];
  let activeFile: any = "";
  if (typeof window !== "undefined") {
    activeFile = localStorage.getItem("currentFile");
    console.log(activeFile);
    let keys = Object.keys(localStorage);
    let i = keys.length;
    while (i--) {
      if (keys[i].match(".+.md")) {
        files.push({
          fileName: keys[i],
          content: localStorage.getItem(keys[i]),
        });
      }
    }
  }

  if (files && activeFile) {
    return { activeFile: activeFile, files: files };
  }
  return initialState;
}

const actions = {
  ADD_NEW_FILE: "ADD_NEW_FILE",
  REMOVE_FILE: "REMOVE_FILE",
  RENAME_FILE: "RENAME_FILE",
};

const reducer = (state: { activeFile: string; files: any[] }, action: any) => {
  switch (action.type) {
    case actions.ADD_NEW_FILE:
      const fileName = action.fileName;
      localStorage.setItem(fileName, "");
      localStorage.setItem("currentFile", fileName);
      return {
        activeFile: fileName,
        files: [
          ...state.files,
          {
            fileName: fileName,
            content: "",
          },
        ],
      };
    case actions.REMOVE_FILE: {
      const filteredFileList = state.files.filter(
        (file) => file.fileName !== action.fileName
      );
      return { activeFile: state.activeFile, files: filteredFileList };
    }
    case actions.RENAME_FILE: {
      const updatedFileList = state.files.map((file) =>
        file.fileName === action.fileName
          ? { fileName: action.newFileName, content: file.content }
          : file
      );
      return { activeFile: state.activeFile, files: updatedFileList };
    }
    default:
      return state;
  }
};

interface appContext {
  activeFile?: string;
  files?: any[];
  addNewFile?: (fileName: string) => void;
  removeFile?: (fileName: string) => void;
  renameFile?: (fileName: string, newFileName: string) => void;
}

export const FilesContext = React.createContext<appContext>({});

const FileProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState, init);

  const value = {
    activeFile: state.activeFile,
    files: state.files,
    addNewFile: (fileName: string) => {
      dispatch({ type: actions.ADD_NEW_FILE, fileName });
    },
    removeFile: (fileName: string) => {
      dispatch({ type: actions.REMOVE_FILE, fileName });
    },
    renameFile: (fileName: string, newFileName: string) => {
      dispatch({ type: actions.RENAME_FILE, fileName, newFileName });
    },
  };

  return (
    <FilesContext.Provider value={value}>
      {props.children}
    </FilesContext.Provider>
  );
};

export default FileProvider;
