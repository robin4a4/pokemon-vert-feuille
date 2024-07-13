import { Frame } from "react95";

export function MapBuilder() {
  return (
    <Frame
      variant="outside"
      shadow
      style={{
        padding: "0.5rem",
        lineHeight: "1.5",
        width: 700,
        display: "block",
        margin: "auto",
      }}
    >
      <h1>Map Builder</h1>
      <p>Build your own map!</p>
    </Frame>
  );
}
