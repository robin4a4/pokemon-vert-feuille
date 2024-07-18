import { SyntheticEvent, useState } from "react";
import {
  Frame,
  GroupBox,
  MenuList,
  MenuListItem,
  Slider,
  Handle,
} from "react95";
import cn from "classnames";
import { DialogContent, DialogRoot } from "../components/Dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

const CELL_SIZE = 18;
const SPRITES = Object.values(
  import.meta.glob("../assets/sprites/*.{png,jpg,jpeg,svg}", {
    eager: true,
    as: "url",
  })
);

export function MapBuilder() {
  const [size, setSize] = useState({ rows: 40, cols: 40 });
  const [currentTool, setCurrentTool] = useState<"brush" | "eraser">("brush");
  const [selectedSprite, setSelectedSprite] = useState<string | null>(null);

  const [grid, setGrid] = useState(
    Array.from({ length: size.rows }, () =>
      Array(size.cols).fill({
        sprite: null,
      })
    )
  );

  const paintOnCell = (el: HTMLButtonElement) => {
    const row = parseInt(el.dataset.row as string);
    const col = parseInt(el.dataset.col as string);

    if (!row || !col) return;

    if (currentTool === "eraser") {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = {
          sprite: null,
        };
        return newGrid;
      });
    } else {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = {
          sprite: selectedSprite,
        };
        return newGrid;
      });
    }
  };

  const toggleSpriteOnCell = (ev: SyntheticEvent) => {
    const target = (ev.target as HTMLElement).closest(
      "button"
    ) as HTMLButtonElement;

    paintOnCell(target);
  };

  const handleDrag = (ev: SyntheticEvent & { buttons: number }) => {
    const isDragging = ev.buttons > 0;
    if (!isDragging) return;

    const target = (ev.target as HTMLElement).closest(
      "button"
    ) as HTMLButtonElement;

    paintOnCell(target);
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
          onPointerMove={handleDrag}
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
          {[...SPRITES].splice(0, 15).map((sprite, i) => (
            <MenuListItem
              key={i}
              as="button"
              data-name={sprite}
              onClick={(ev: SyntheticEvent) => {
                const target = ev.currentTarget as HTMLButtonElement;
                console.log("SELECTED", target.dataset.name);
                setCurrentTool("brush");
                setSelectedSprite(target.dataset.name as string);
              }}
              className={cn({
                "bg-teal-600":
                  selectedSprite === sprite && currentTool === "brush",
              })}
            >
              <img
                src={sprite}
                alt={`sprite-${i}`}
                style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
              />
            </MenuListItem>
          ))}
          <Handle size={38} />
          <MenuListItem
            as="button"
            onClick={() => setCurrentTool("eraser")}
            className={cn({
              "bg-teal-600 !text-white": currentTool === "eraser",
            })}
          >
            Eraser
          </MenuListItem>
          <Handle size={38} />
          <DialogRoot>
            <DialogTrigger asChild>
              <MenuListItem as="button">Settings</MenuListItem>
            </DialogTrigger>
            <DialogContent title="Settings">
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
            </DialogContent>
          </DialogRoot>
        </MenuList>
      </div>
    </div>
  );
}
