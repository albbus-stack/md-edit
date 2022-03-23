import { useFilesContext } from "../components/FileProvider";

enum Actions {
  ADD_NEW_FILE = "Add new file",
  REMOVE_FILE = "Remove file",
  RENAME_FILE = "Rename file",
}

export interface Suggestion {
    value: string;
    //action:void;
}

interface Props {
    query: string;
}

interface ReturnProps {
    suggestions:Suggestion[];
}

const searchProvider = ({query}:Props): ReturnProps => {

    let suggestions:Suggestion[] = [];
    if(query !== ""){
        for(let action of Object.values(Actions)){
            if(action.toLowerCase().includes(query.toLowerCase())){
                suggestions.push({value:action})
            }
        }
    }
    return {suggestions:suggestions};
}

export default searchProvider;