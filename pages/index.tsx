import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import editorTheme from "../lib/editorTheme";
import dynamic from "next/dynamic";
import { useFilesContext } from "../components/FileProvider";

const NavBar = dynamic(() => import("../components/NavBar"), {
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
    modifyFile,
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
    files.map((file) => {
      if (file.fileName === activeFile) {
        setText(file.content);
        setNewText(file.content);
      }
    });
  }, [activeFile]);

  const themeColors = {
    "--primary-color": 0,
    // fetch this and other colors from a custom theme manager hook
  } as React.CSSProperties;

  return (
    <div className="container" style={themeColors}>
      <NavBar></NavBar>
      <Editor
        theme={editorTheme}
        onChange={(value) => {
          setText(value);
          localStorage.setItem(activeFile, text);
          modifyFile(activeFile, text);
        }}
        value={newText}
        autoFocus={true}
        onSave={() => {
          localStorage.setItem(activeFile, text);
          modifyFile(activeFile, text);
        }}
        className="field"
      />
    </div>
  );
};

export default Home;
