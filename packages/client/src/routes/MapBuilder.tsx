import { SyntheticEvent, useState } from "react";
import { Frame, GroupBox, MenuList, MenuListItem, Slider } from "react95";
import cn from "classnames";

const CELL_SIZE = 18;
const SPRITES = Object.values(
  import.meta.glob("../assets/sprites/*.{png,jpg,jpeg,svg}", {
    eager: true,
    as: "url",
  })
);

export function MapBuilder() {
  const [size, setSize] = useState({ rows: 40, cols: 40 });
  const [selectedSprite, setSelectedSprite] = useState<string | null>(null);

  const [grid, setGrid] = useState(
    Array.from({ length: size.rows }, () =>
      Array(size.cols).fill({
        sprite: null,
      })
    )
  );

  const toggleSpriteOnCell = (ev: SyntheticEvent) => {
    const target = ev.currentTarget as HTMLButtonElement;

    if (!selectedSprite) return;

    const currentSprite = target.dataset.sprite;
    const row = parseInt(target.dataset.row as string);
    const col = parseInt(target.dataset.col as string);

    if (!row || !col) return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = {
        sprite: currentSprite ? null : selectedSprite,
      };
      return newGrid;
    });
  };

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
              <button
                type="button"
                onClick={toggleSpriteOnCell}
                data-row={i}
                data-col={j}
                data-sprite={row.sprite}
                key={`${i}-${j}`}
                style={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              >
                {row.sprite ? (
                  <img src={row.sprite} width={CELL_SIZE} height={CELL_SIZE} />
                ) : null}
              </button>
            ))
          )}
        </div>
      </Frame>
      <div className="relative">
        <MenuList inline style={{ width: 700 }}>
          {[...SPRITES].splice(0, 20).map((sprite, i) => (
            <MenuListItem
              key={i}
              as="button"
              data-name={sprite}
              onClick={(ev: SyntheticEvent) => {
                const target = ev.currentTarget as HTMLButtonElement;
                console.log("SELECTED", target.dataset.name);
                setSelectedSprite(target.dataset.name as string);
              }}
              className={cn({
                "bg-teal-600": selectedSprite === sprite,
              })}
            >
              <img
                src={sprite}
                alt={`sprite-${i}`}
                style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
              />
            </MenuListItem>
          ))}
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
