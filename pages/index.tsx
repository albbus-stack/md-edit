import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import editorTheme from "./editorTheme";

const Home: NextPage = () => {
  const [text, setText] = useState(() => {
    let textData = "";
    if (typeof window !== "undefined") {
      const file = localStorage.getItem("currentFile");
      textData = localStorage.getItem(file ?? "") ?? "";
    }
    return textData;
  });

  const [fileName, setFileName] = useState("file.md");

  const [modified, setModified] = useState(false);

  return (
    <div className="container">
      <div className="filename">
        <div className="italic">{fileName}</div>
        <span>{modified ? "•" : ""}</span>
        <div className="spacer"></div>
        <button className="editFileNameButton">✏️</button>
        <button className="newFileButton">+</button>
      </div>
      <Editor
        theme={editorTheme}
        onChange={(value) => {
          setText(value);
          setModified(true);
        }}
        defaultValue={text}
        autoFocus={true}
        onSave={() => {
          localStorage.setItem(fileName, text);
          localStorage.setItem("currentFile", fileName);
          setModified(false);
        }}
        className="field"
      />
    </div>
  );
};

export default Home;
