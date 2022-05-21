import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import editorTheme from "../lib/editorTheme";
import dynamic from "next/dynamic";
import { useFilesContext } from "../components/FileProvider";
import { useThemeContext } from "../components/ThemeManager";
import Head from "next/head";

const NavBar = dynamic(() => import("../components/NavBar"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { activeFile, files, modifyFile } = useFilesContext();

  const [newText, setNewText] = useState("");

  const { theme } = useThemeContext();

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

  useEffect(() => {
    document.body.style.setProperty(
      "--background-color",
      theme.backgroundColor
    );
    document.body.style.setProperty("--text-color", theme.textColor);
    document.body.style.setProperty("--active-file-color", theme.accentColor);
    document.body.style.setProperty("--border-color", theme.borderColor);
  }, [theme]);

  return (
    <>
      <Head>
        <meta name="theme-color" content={theme.backgroundColor} />
      </Head>
      <div className="container">
        <NavBar currentText={text} setCurrentText={setText}></NavBar>
        <Editor
          theme={{
            ...editorTheme,
            background: theme.backgroundColor,
            text: theme.textColor,
          }}
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
    </>
  );
};

export default Home;
