import React, { useContext, useReducer } from "react";

interface Theme {
  backgroundColor: string;
  textColor: string;
  activeFileColor: string;
}

enum Actions {
  CHANGE_COLORS = "CHANGE_COLORS",
}

interface Action {
  type: Actions;
  theme: Theme;
}

interface Context {
  theme: Theme;
  changeColors: (theme: {
    backgroundColor: string;
    textColor: string;
    activeFileColor: string;
  }) => void;
}

interface State {
  theme: Theme;
}

const initialState: State = {
  theme: {
    backgroundColor: "#002b36",
    textColor: "white",
    activeFileColor: "#003b49",
  },
};

function initializeState(): State {
  let backgroundColor: string = "";
  let textColor: string = "";
  let activeFileColor: string = "";
  if (typeof window !== "undefined") {
    backgroundColor = localStorage.getItem("backgroundColor") ?? "#002b36";
    textColor = localStorage.getItem("textColor") ?? "white";
    activeFileColor = localStorage.getItem("activeFileColor") ?? "#003b49";
    if (backgroundColor === "" || textColor === "") {
      localStorage.setItem("backgroundColor", "#002b36");
      localStorage.setItem("textColor", "white");
      localStorage.setItem("activeFileColor", "#003b49");
    }
  }

  if (backgroundColor && textColor) {
    return {
      theme: {
        backgroundColor: backgroundColor,
        textColor: textColor,
        activeFileColor: activeFileColor,
      },
    };
  }
  return initialState;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.CHANGE_COLORS: {
      const background: string = action.theme.backgroundColor;
      const text: string = action.theme.textColor;
      const activeFile: string = action.theme.activeFileColor;
      return {
        theme: {
          backgroundColor: background,
          textColor: text,
          activeFileColor: activeFile,
        },
      };
    }

    default:
      return state;
  }
};

export const ThemeContext = React.createContext<Context | undefined>(undefined);

export const useThemeContext = (): Context => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw Error(
      "useThemeContext must be used inside the ThemeContext.Provider"
    );
  }
  return context;
};

const ThemeManager: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState, initializeState);

  const value: Context = {
    theme: state.theme,
    changeColors: (theme: Theme) => {
      dispatch({ type: Actions.CHANGE_COLORS, theme });
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeManager;
