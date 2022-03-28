import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  initialColor: string;
}

const ColorPicker: React.FC<Props> = ({ initialColor }) => {
  const [color, setColor] = useState(initialColor);

  return <HexColorPicker color={color} onChange={setColor} />;
};

export default ColorPicker;
