import { useState } from "react";
import { Frame, GroupBox, MenuList, MenuListItem, Slider } from "react95";

const CELL_SIZE = 18;

export function MapBuilder() {
  const [size, setSize] = useState({ rows: 40, cols: 40 });

  const grid = Array.from({ length: size.rows }, () =>
    Array(size.cols).fill(0)
  );
  return (
    <div
      className="flex flex-col justify-between gap-4 items-center"
      style={{
        height: "calc(100vh - 32px)",
      }}
    >
      <Frame
        variant="outside"
        shadow
        style={{
          padding: "0.5rem",
          lineHeight: "1.5",
        }}
      >
        <div
          className="grid border-t border-l border-black/10"
          style={{
            gridTemplateColumns: `repeat(${size.rows}, ${CELL_SIZE}px)`,
          }}
        >
          {grid.map((col, i) =>
            col.map((row, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            ))
          )}
        </div>
      </Frame>
      <div className="relative">
        <MenuList inline style={{ width: 700 }}>
          <MenuListItem square>
            <span role="img" aria-label="😎">
              😎
            </span>
          </MenuListItem>
          <MenuListItem square>
            <span role="img" aria-label="🤖">
              🤖
            </span>
          </MenuListItem>
          <MenuListItem square>
            <span role="img" aria-label="🎁">
              🎁
            </span>
          </MenuListItem>
        </MenuList>
        <Frame
          style={{
            position: "absolute",
            width: 300,
            bottom: 0,
            marginLeft: 16,
            padding: "0.5rem",
          }}
        >
          <GroupBox label="Rows">
            <Slider
              size="200px"
              defaultValue={40}
              min={20}
              max={80}
              step={10}
              onChange={(value) => setSize({ ...size, rows: value })}
              marks={[
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 40, label: "40" },
                { value: 50, label: "50" },
                { value: 60, label: "60" },
                { value: 70, label: "70" },
                { value: 80, label: "80" },
              ]}
            />
          </GroupBox>
          <br />
          <GroupBox label="Columns">
            <Slider
              size="200px"
              defaultValue={40}
              min={20}
              max={80}
              step={10}
              onChange={(value) => setSize({ ...size, cols: value })}
              marks={[
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 40, label: "40" },
                { value: 50, label: "50" },
                { value: 60, label: "60" },
                { value: 70, label: "70" },
                { value: 80, label: "80" },
              ]}
            />
          </GroupBox>
        </Frame>
      </div>
    </div>
  );
}
