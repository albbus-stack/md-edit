import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useThemeContext } from "./ThemeManager";

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeEditor: React.FC<Props> = ({ isOpen, setOpen }) => {
  const themeEditorWrapperClass =
    "themeEditorWrapper" + (!isOpen ? " opacity-0" : "");

  const { theme, changeColors } = useThemeContext();

  const [backgroundColor, setBackgroundColor] = useState(theme.backgroundColor);
  const [textColor, setTextColor] = useState(theme.textColor);
  const [accentColor, setAccentColor] = useState(theme.accentColor);

  const [isBackgroundPickerOpen, setBackgroundPickerOpen] = useState(false);
  const [isTextPickerOpen, setTextPickerOpen] = useState(false);
  const [isAccentPickerOpen, setAccentPickerOpen] = useState(false);

  useEffect(() => {
    return () => {
      changeColors({
        backgroundColor: backgroundColor,
        textColor: textColor,
        accentColor: accentColor,
      });
    };
  }, [backgroundColor, textColor, accentColor]);

  useEffect(() => {
    if (isBackgroundPickerOpen) {
      setAccentPickerOpen(false);
      setTextPickerOpen(false);
    }
  }, [isBackgroundPickerOpen]);

  useEffect(() => {
    if (isTextPickerOpen) {
      setBackgroundPickerOpen(false);
      setAccentPickerOpen(false);
    }
  }, [isTextPickerOpen]);

  useEffect(() => {
    if (isAccentPickerOpen) {
      setTextPickerOpen(false);
      setBackgroundPickerOpen(false);
    }
  }, [isAccentPickerOpen]);

  return (
    <div className={themeEditorWrapperClass}>
      <div
        className="closeThemeEditor"
        onClick={() => {
          setOpen((prevState) => !prevState);
        }}
      >
        🞩
      </div>
      <ColorPicker
        colorState={backgroundColor}
        setColorState={setBackgroundColor}
        description="background"
        isPickerOpen={isBackgroundPickerOpen}
        setPickerOpen={setBackgroundPickerOpen}
      />
      <ColorPicker
        colorState={textColor}
        setColorState={setTextColor}
        description="text"
        isPickerOpen={isTextPickerOpen}
        setPickerOpen={setTextPickerOpen}
      />
      <ColorPicker
        colorState={accentColor}
        setColorState={setAccentColor}
        description="accent"
        isPickerOpen={isAccentPickerOpen}
        setPickerOpen={setAccentPickerOpen}
      />
    </div>
  );
};

export default ThemeEditor;
