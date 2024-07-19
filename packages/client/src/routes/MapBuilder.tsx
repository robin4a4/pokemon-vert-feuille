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

type Grid = Array<Array<{ sprite: string | null }>>;

function paint(
  prevGrid: Grid,
  row: number,
  col: number,
  brushSize: number,
  selectedSprite: string | null
) {
  const newGrid = [...prevGrid];
  for (let i = row; i <= row + brushSize - 1; i++) {
    for (let j = col; j <= col + brushSize - 1; j++) {
      if (i >= 0 && i < newGrid.length && j >= 0 && j < newGrid[0].length) {
        newGrid[i][j] = {
          sprite: selectedSprite,
        };
      }
    }
  }
  return newGrid;
}

export function MapBuilder() {
  const [currentTool, setCurrentTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(1);
  const [selectedSprite, setSelectedSprite] = useState<string | null>(null);

  const [grid, setGrid] = useState<Array<Array<{ sprite: string | null }>>>(
    Array.from({ length: 40 }, () =>
      Array.from({ length: 40 }, () => ({
        sprite: null,
      }))
    )
  );

  const paintOnCell = (el: HTMLButtonElement) => {
    const row = parseInt(el.dataset.row as string);
    const col = parseInt(el.dataset.col as string);

    if (row === undefined || col === undefined) return;

    if (currentTool === "eraser") {
      setGrid((prevGrid) => paint(prevGrid, row, col, brushSize, null));
    } else {
      setGrid((prevGrid) =>
        paint(prevGrid, row, col, brushSize, selectedSprite)
      );
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
          className="grid !border-t !border-l !border-black/10"
          style={{
            gridTemplateColumns: `repeat(${grid.length}, ${CELL_SIZE}px)`,
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
                  <img
                    src={row.sprite}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    className="pointer-events-none"
                  />
                ) : null}
              </button>
            ))
          )}
        </div>
      </Frame>
      <div className="relative">
        <MenuList inline style={{ width: 800 }}>
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
          <DialogRoot>
            <DialogTrigger asChild>
              <MenuListItem as="button">All sprites</MenuListItem>
            </DialogTrigger>
            <DialogContent title="Settings">
              <div className="grid grid-cols-8 gap-1">
                {[...SPRITES].map((sprite, i) => (
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
              </div>
            </DialogContent>
          </DialogRoot>
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
                  defaultValue={grid.length}
                  min={20}
                  max={80}
                  step={10}
                  onChange={(value) => {
                    setGrid((prevGrid) => {
                      const newGrid = Array.from({ length: value }, () =>
                        Array.from({ length: prevGrid[0].length }, () => ({
                          sprite: null,
                        }))
                      );
                      return newGrid;
                    });
                  }}
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
                  defaultValue={grid[0].length}
                  min={20}
                  max={80}
                  step={10}
                  onChange={(value) => {
                    setGrid((prevGrid) => {
                      const newGrid = Array.from(
                        { length: prevGrid.length },
                        () =>
                          Array.from({ length: value }, () => ({
                            sprite: null,
                          }))
                      );
                      return newGrid;
                    });
                  }}
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
              <GroupBox label="Brush size">
                <Slider
                  size="200px"
                  defaultValue={brushSize}
                  min={1}
                  max={7}
                  step={1}
                  onChange={(value) => setBrushSize(value)}
                  marks={[
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" },
                    { value: 4, label: "4" },
                    { value: 5, label: "5" },
                    { value: 6, label: "6" },
                    { value: 7, label: "7" },
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
