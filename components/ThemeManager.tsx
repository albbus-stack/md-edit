import React, { useContext, useReducer } from "react";

enum Actions {
  CHANGE_COLORS = "CHANGE_COLORS",
}

interface Action {
  type: Actions;
  backgroundColor: string;
  textColor: string;
}

interface Context {
  backgroundColor: string;
  textColor: string;
  changeColors: (backgroundColor: string, textColor: string) => void;
}

interface State {
  backgroundColor: string;
  textColor: string;
}

const initialState: State = {
  backgroundColor: "",
  textColor: "",
};

function initializeState(): State {
  let backgroundColor: string = "";
  let textColor: string = "";
  if (typeof window !== "undefined") {
    backgroundColor = localStorage.getItem("backgroundColor") ?? "";
    textColor = localStorage.getItem("textColor") ?? "";
    if (backgroundColor === "" || textColor === "") {
      localStorage.setItem("backgroundColor", "#002b36");
      localStorage.setItem("textColor", "white");
    }
  }

  if (backgroundColor && textColor) {
    return { backgroundColor: backgroundColor, textColor: textColor };
  }
  return initialState;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.CHANGE_COLORS: {
      const background: string = action.backgroundColor;
      const text: string = action.textColor;
      return {
        backgroundColor: background,
        textColor: text,
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
    backgroundColor: state.backgroundColor,
    textColor: state.textColor,
    changeColors: (backgroundColor: string, textColor: string) => {
      dispatch({ type: Actions.CHANGE_COLORS, backgroundColor, textColor });
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeManager;
