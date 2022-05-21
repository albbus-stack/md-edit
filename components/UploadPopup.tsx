import React, { useState } from "react";
import { useFilesContext } from "./FileProvider";

interface Props {
  setUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadPopup: React.FC<Props> = ({ setUploadOpen }) => {
  const [selectedFile, setSelectedFile] = useState({} as File);
  const { addNewFile, switchToFile, addToTabs } = useFilesContext();

  return (
    <>
      <input
        type="file"
        className="row"
        name="fileUpload"
        onChange={(e) => {
          if (e.target.files !== null) {
            setSelectedFile(e.target.files[0]);
          }
        }}
      />
      <div className="buttonRow">
        <button
          className="uploadButton"
          onClick={async () => {
            setUploadOpen(false);
            addNewFile(selectedFile.name, await selectedFile.text());
            addToTabs(selectedFile.name);
            switchToFile(selectedFile.name);
          }}
        >
          Upload
        </button>
      </div>
    </>
  );
};

export default UploadPopup;
