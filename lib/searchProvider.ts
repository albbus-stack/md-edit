import { Actions } from "../components/FileProvider";

enum ReadableActions {
  ADD_NEW_FILE = "Add new file",
  REMOVE_FILE = "Remove file",
  RENAME_FILE = "Rename file",
  OPEN_THEME_EDITOR = "Open theme editor",
}

export interface Suggestion {
  value: string;
  action?: Actions;
}

interface Props {
  query: string;
}

interface ReturnProps {
  suggestions: Suggestion[];
}

const searchProvider = ({ query }: Props): ReturnProps => {
  let suggestions: Suggestion[] = [];
  if (query !== "") {
    for (let action of Object.values(ReadableActions)) {
      if (action.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          value: action,
          action:
            action != ReadableActions.OPEN_THEME_EDITOR
              ? Object.values(Actions)[
                  Object.values(ReadableActions).indexOf(action)
                ]
              : undefined,
        });
      }
    }
  }
  return { suggestions: suggestions };
};

export default searchProvider;
