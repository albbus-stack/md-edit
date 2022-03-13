import React, { useContext } from "react";

enum Actions {
  ADD_NEW_FILE = "ADD_NEW_FILE",
  REMOVE_FILE = "REMOVE_FILE",
  RENAME_FILE = "RENAME_FILE",
  SWITCH_TO_FILE = "SWITCH_TO_FILE",
}

interface Context {
  activeFile: string;
  files: any[];
  addNewFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  renameFile: (fileName: string, newFileName: string) => void;
  switchToFile: (fileName: string) => void;
}

interface State {
  activeFile: string;
  files: any[];
}

interface Action {
  type: Actions;
  fileName: string;
  newFileName?: string;
}

const initialState: State = {
  activeFile: "",
  files: [{}],
};

function initializeState(): State {
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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.ADD_NEW_FILE:
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
    case Actions.REMOVE_FILE: {
      const filteredFileList = state.files.filter(
        (file) => file.fileName !== action.fileName
      );
      localStorage.removeItem(action.fileName);
      return { activeFile: state.activeFile, files: filteredFileList };
    }
    case Actions.RENAME_FILE: {
      const updatedFileList = state.files.map((file) =>
        file.fileName === action.fileName
          ? { fileName: action.newFileName, content: file.content }
          : file
      );
      localStorage.setItem(
        action.newFileName ?? "",
        localStorage.getItem(action.fileName) ?? ""
      );
      localStorage.removeItem(action.fileName);
      localStorage.setItem("currentFile", action.newFileName ?? "");
      return { activeFile: state.activeFile, files: updatedFileList };
    }
    case Actions.SWITCH_TO_FILE: {
      return { activeFile: action.fileName, files: state.files };
    }
    default:
      return state;
  }
};

export const FilesContext = React.createContext<Context | undefined>(undefined);

export const useFilesContext = (): Context => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw Error(
      "useFilesContext must be used inside the FilesContext.Provider"
    );
  }
  return context;
};

const FileProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(
    reducer,
    initialState,
    initializeState
  );

  const value = {
    activeFile: state.activeFile,
    files: state.files,
    addNewFile: (fileName: string) => {
      dispatch({ type: Actions.ADD_NEW_FILE, fileName });
    },
    removeFile: (fileName: string) => {
      dispatch({ type: Actions.REMOVE_FILE, fileName });
    },
    renameFile: (fileName: string, newFileName: string) => {
      dispatch({ type: Actions.RENAME_FILE, fileName, newFileName });
    },
    switchToFile: (fileName: string) => {
      dispatch({ type: Actions.SWITCH_TO_FILE, fileName });
    },
  };

  return (
    <FilesContext.Provider value={value}>
      {props.children}
    </FilesContext.Provider>
  );
};

export default FileProvider;
