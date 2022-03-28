import ColorPicker from "./ColorPicker";

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeEditor: React.FC<Props> = ({ isOpen, setOpen }) => {
  const themeEditorWrapperClass =
    "themeEditorWrapper" + (!isOpen ? " opacity-0" : "");
  return (
    <div className={themeEditorWrapperClass}>
      <ColorPicker initialColor="#000000" />
    </div>
  );
};

export default ThemeEditor;
