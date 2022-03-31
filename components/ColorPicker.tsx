import { useState } from "react";
import { HexColorPicker, RgbColor } from "react-colorful";

interface Props {
  colorState: string;
  setColorState: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  isPickerOpen: boolean;
  setPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColorPicker: React.FC<Props> = ({
  colorState,
  setColorState,
  description,
  isPickerOpen,
  setPickerOpen,
}) => {
  const [internalColor, setInternalColor] = useState(colorState);

  return (
    <div className="colorSelectorLine">
      {description}
      <div className="spacer"></div>
      <div
        className="colorCircle"
        style={{ backgroundColor: colorState }}
        onClick={() => {
          setPickerOpen((prevState) => !prevState);
        }}
      ></div>
      {isPickerOpen ? (
        <>
          <HexColorPicker
            className="colorPicker"
            color={colorState}
            onChange={(newColor) => {
              setInternalColor(newColor);
            }}
          />
          <div
            className="confirmColorPicker"
            onClick={() => {
              setColorState(internalColor);
            }}
          >
            ✓
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ColorPicker;
