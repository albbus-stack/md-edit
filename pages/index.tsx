import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import editorTheme from "./editorTheme";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./NavBar"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [text, setText] = useState(() => {
    let textData = "";
    if (typeof window !== "undefined") {
      const file = localStorage.getItem("currentFile");
      textData = localStorage.getItem(file ?? "") ?? "";
    }
    return textData;
  });

  const [fileName, setFileName] = useState(() => {
    let filename = "";
    if (typeof window !== "undefined") {
      filename = localStorage.getItem("currentFile") ?? "";
    }
    return filename;
  });

  // useReducer to make this global, here we only want to update it
  const [modified, setModified] = useState(false);

  const [fileNameInput, setFileNameInput] = useState("");

  const handleEditFilename = () => {
    // ask for a newFileName through an inline input
    let newFileName: string = fileName;
    setFileName(newFileName);
  };

  const handleNewFile = () => {
    // ask for a newFileName through an inline input
    let newFileName: string = fileName;
    setFileName(newFileName);
    setText("");
    localStorage.setItem(newFileName, text);
    localStorage.setItem("currentFile", newFileName);
  };

  return (
    <div className="container">
      <NavBar isModified={modified}></NavBar>
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
