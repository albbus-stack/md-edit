import React, { useContext, useReducer } from "react";

interface Theme {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
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
    accentColor: string;
    borderColor: string;
  }) => void;
}

interface State {
  theme: Theme;
}

const initialState: State = {
  theme: {
    backgroundColor: "#002b36",
    textColor: "white",
    accentColor: "#003b49",
    borderColor: "#4A4257",
  },
};

function initializeState(): State {
  let themeString: string = "";
  let backgroundColor: string = "";
  let textColor: string = "";
  let accentColor: string = "";
  let borderColor: string = "";
  if (typeof window !== "undefined") {
    themeString =
      localStorage.getItem("theme") ?? "#002b36,white,#003b49,#4A4257";
    if (themeString === "#002b36,white,#003b49") {
      localStorage.setItem("theme", "#002b36,white,#003b49,#4A4257");
    }
    [backgroundColor, textColor, accentColor] = themeString.split(",");
  }

  if (backgroundColor && textColor) {
    return {
      theme: {
        backgroundColor: backgroundColor,
        textColor: textColor,
        accentColor: accentColor,
        borderColor: borderColor,
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
      const accent: string = action.theme.accentColor;
      const border: string = action.theme.borderColor;
      localStorage.setItem(
        "theme",
        background + "," + text + "," + accent + "," + border
      );
      return {
        theme: {
          backgroundColor: background,
          textColor: text,
          accentColor: accent,
          borderColor: border,
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
