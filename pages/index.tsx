import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import editorTheme from "./editorTheme";
import dynamic from "next/dynamic";
import { useFilesContext } from "./fileProvider";

const NavBar = dynamic(() => import("./NavBar"), {
  ssr: false,
});

const Home: NextPage = () => {
  const {
    activeFile,
    files,
    addNewFile,
    removeFile,
    renameFile,
    switchToFile,
  } = useFilesContext();

  const [newText, setNewText] = useState("");

  const [text, setText] = useState(() => {
    let textData = "";
    files.map((file) => {
      if (file.fileName === activeFile) {
        textData = file.content;
      }
    });
    return textData;
  });

  useEffect(() => {
    localStorage.setItem("currentFile", activeFile);
    files.map((file) => {
      if (file.fileName === activeFile) {
        setText(file.content);
        setNewText(file.content);
      }
    });
  }, [activeFile]);

  const [fileName, setFileName] = useState(() => {
    let filename = "";
    if (typeof window !== "undefined") {
      filename = localStorage.getItem("currentFile") ?? "";
    }
    return filename;
  });

  const [modified, setModified] = useState(false);

  return (
    <div className="container">
      <NavBar isModified={modified}></NavBar>
      <Editor
        theme={editorTheme}
        onChange={(value) => {
          setText(value);
          setModified(true);
        }}
        value={newText}
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
