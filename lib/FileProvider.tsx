import React, { useContext } from "react";

interface File {
  fileName: string;
  content: string;
}

enum Actions {
  ADD_NEW_FILE = "ADD_NEW_FILE",
  REMOVE_FILE = "REMOVE_FILE",
  RENAME_FILE = "RENAME_FILE",
  SWITCH_TO_FILE = "SWITCH_TO_FILE",
  MODIFY_FILE = "MODIFY_FILE",
}

interface Action {
  type: Actions;
  fileName: string;
  newFileName?: string;
  content?: string;
}

interface Context {
  activeFile: string;
  files: File[];
  addNewFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  renameFile: (fileName: string, newFileName: string) => void;
  switchToFile: (fileName: string) => void;
  modifyFile: (fileName: string, content: string) => void;
}

interface State {
  activeFile: string;
  files: File[];
}

const initialState: State = {
  activeFile: "",
  files: [{ fileName: "", content: "" } as File],
};

function initializeState(): State {
  let files: File[] = [];
  let activeFile: string = "";
  if (typeof window !== "undefined") {
    activeFile = localStorage.getItem("currentFile") ?? "";
    if (activeFile === "") {
      files.push({
        fileName: "new.md",
        content: "# New",
      } as File);
      localStorage.setItem("currentFile", "new.md");
      localStorage.setItem("new.md", "# New");
    }
    let keys = Object.keys(localStorage);
    let i = keys.length;
    while (i--) {
      if (keys[i].match(".+.md")) {
        files.push({
          fileName: keys[i],
          content: localStorage.getItem(keys[i]) ?? "",
        } as File);
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
      return {
        activeFile: fileName,
        files: [
          ...state.files,
          {
            fileName: fileName,
            content: "# " + fileName.toString(),
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
          ? ({ fileName: action.newFileName, content: file.content } as File)
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
    case Actions.MODIFY_FILE: {
      const updatedFileList = state.files.map((file) =>
        file.fileName === action.fileName
          ? ({ fileName: action.fileName, content: action.content } as File)
          : file
      );
      return { activeFile: state.activeFile, files: updatedFileList };
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
    modifyFile: (fileName: string, content: string) => {
      dispatch({ type: Actions.MODIFY_FILE, fileName, content });
    },
  };

  return (
    <FilesContext.Provider value={value}>
      {props.children}
    </FilesContext.Provider>
  );
};

export default FileProvider;
