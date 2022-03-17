import React, { useContext, useReducer } from "react";

interface File {
  fileName: string;
  content: string;
  isActive?: boolean;
}

enum Actions {
  ADD_NEW_FILE = "ADD_NEW_FILE",
  REMOVE_FILE = "REMOVE_FILE",
  RENAME_FILE = "RENAME_FILE",
  SWITCH_TO_FILE = "SWITCH_TO_FILE",
  MODIFY_FILE = "MODIFY_FILE",
  ADD_TO_TABS = "ADD_TO_TABS",
  REMOVE_FROM_TABS = "REMOVE_FROM_TABS",
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
  tabbedFiles: File[];
  addNewFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  renameFile: (fileName: string, newFileName: string) => void;
  switchToFile: (fileName: string) => void;
  modifyFile: (fileName: string, content: string) => void;
  addToTabs: (fileName: string) => void;
  removeFromTabs: (fileName: string) => void;
}

interface State {
  activeFile: string;
  files: File[];
  tabbedFiles: File[];
}

const initialState: State = {
  activeFile: "welcome.md",
  files: [{ fileName: "welcome.md", content: "# Welcome" } as File],
  tabbedFiles: [{ fileName: "welcome.md", content: "# Welcome" } as File],
};

function initializeState(): State {
  let files: File[] = [];
  let tabbedFiles: File[] = [];
  let activeFile: string = "";
  if (typeof window !== "undefined") {
    activeFile = localStorage.getItem("currentFile") ?? "";
    if (activeFile === "") {
      const newFileName: string = "welcome.md";
      const newFileNameContent: string = "# Welcome";
      files.push({
        fileName: newFileName,
        content: newFileNameContent,
      } as File);
      tabbedFiles.push({
        fileName: newFileName,
        content: newFileNameContent,
      } as File);
      localStorage.setItem("tabbedFiles", newFileName);
      localStorage.setItem("currentFile", newFileName);
      localStorage.setItem(newFileName, newFileNameContent);
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
    const tabbedFilesString: string = localStorage.getItem("tabbedFiles") ?? "";
    const tabbedFilesSplit = tabbedFilesString
      .split(" ")
      .filter((file) => file !== "");
    for (let file of tabbedFilesSplit) {
      tabbedFiles.push({
        fileName: file,
        content: localStorage.getItem(file) ?? "",
      } as File);
    }
  }

  if (files && activeFile && tabbedFiles) {
    return { activeFile: activeFile, files: files, tabbedFiles: tabbedFiles };
  }
  return initialState;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.ADD_NEW_FILE: {
      const fileName: string = action.fileName;
      return {
        activeFile: fileName,
        files: [
          ...state.files,
          {
            fileName: fileName,
            content: "# " + fileName.toString(),
          },
        ],
        tabbedFiles: state.tabbedFiles,
      };
    }

    case Actions.REMOVE_FILE: {
      const filteredFileList: File[] = state.files.filter(
        (file) => file.fileName !== action.fileName
      );
      const filteredTabbedFileList: File[] = state.tabbedFiles.filter(
        (file) => file.fileName !== action.fileName
      );
      localStorage.removeItem(action.fileName);
      return {
        activeFile:
          action.fileName === state.activeFile
            ? filteredTabbedFileList[0].fileName
            : state.activeFile,
        files: filteredFileList,
        tabbedFiles: filteredTabbedFileList,
      };
    }

    case Actions.RENAME_FILE: {
      const updatedFileList: File[] = state.files.map((file) =>
        file.fileName === action.fileName
          ? ({ fileName: action.newFileName, content: file.content } as File)
          : file
      );
      const updatedTabbedFilesList: File[] = state.tabbedFiles.map((file) =>
        file.fileName === action.fileName
          ? ({ fileName: action.newFileName, content: file.content } as File)
          : file
      );
      let tabbedFiles: string = localStorage.getItem("tabbedFiles") ?? "";
      let splitTabbedFiles: string[] = tabbedFiles
        .split(" ")
        .filter((file) => file !== action.fileName);
      tabbedFiles = splitTabbedFiles.join(" ");
      tabbedFiles += " " + action.newFileName;
      localStorage.setItem("tabbedFiles", tabbedFiles.trimStart());
      localStorage.setItem(
        action.newFileName ?? "",
        localStorage.getItem(action.fileName) ?? ""
      );
      localStorage.removeItem(action.fileName);
      localStorage.setItem("currentFile", action.newFileName ?? "");
      return {
        activeFile: state.activeFile,
        files: updatedFileList,
        tabbedFiles: updatedTabbedFilesList,
      };
    }

    case Actions.SWITCH_TO_FILE: {
      localStorage.setItem("currentFile", action.fileName);
      return {
        activeFile: action.fileName,
        files: state.files,
        tabbedFiles: state.tabbedFiles,
      };
    }

    case Actions.MODIFY_FILE: {
      const updatedFileList: File[] = state.files.map((file) =>
        file.fileName === action.fileName
          ? ({ fileName: action.fileName, content: action.content } as File)
          : file
      );
      return {
        activeFile: state.activeFile,
        files: updatedFileList,
        tabbedFiles: state.tabbedFiles,
      };
    }

    case Actions.ADD_TO_TABS: {
      let tabbedFilesList = state.tabbedFiles;
      let isAlreadyTabbed: boolean = false;
      state.tabbedFiles.forEach((file) => {
        if (file.fileName === action.fileName) isAlreadyTabbed = true;
      });
      if (!isAlreadyTabbed) {
        for (let file of state.files) {
          if (file.fileName === action.fileName) {
            tabbedFilesList.push(file);
          }
        }
        let tabbedFilesString: string =
          localStorage.getItem("tabbedFiles") ?? "";
        tabbedFilesString += " " + action.fileName;
        localStorage.setItem("tabbedFiles", tabbedFilesString.trimStart());
      }
      return {
        activeFile: state.activeFile,
        files: state.files,
        tabbedFiles: tabbedFilesList,
      };
    }

    case Actions.REMOVE_FROM_TABS: {
      const filteredTabbedFileList: File[] = state.tabbedFiles.filter(
        (file) => file.fileName !== action.fileName
      );
      let tabbedFiles: string = localStorage.getItem("tabbedFiles") ?? "";
      let splitTabbedFiles: string[] = tabbedFiles
        .split(" ")
        .filter((file) => file !== action.fileName);
      tabbedFiles = splitTabbedFiles.join(" ");
      localStorage.setItem("tabbedFiles", tabbedFiles);
      return {
        activeFile: state.activeFile,
        files: state.files,
        tabbedFiles: filteredTabbedFileList,
      };
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
  const [state, dispatch] = useReducer(reducer, initialState, initializeState);

  const value = {
    activeFile: state.activeFile,
    files: state.files,
    tabbedFiles: state.tabbedFiles,
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
    addToTabs: (fileName: string) => {
      dispatch({ type: Actions.ADD_TO_TABS, fileName });
    },
    removeFromTabs: (fileName: string) => {
      dispatch({ type: Actions.REMOVE_FROM_TABS, fileName });
    },
  };

  return (
    <FilesContext.Provider value={value}>
      {props.children}
    </FilesContext.Provider>
  );
};

export default FileProvider;
