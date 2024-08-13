import type { QueryClient } from "@tanstack/react-query";
import cn from "classnames";
import { type SyntheticEvent, useState } from "react";
import {
	Frame,
	GroupBox,
	Handle,
	MenuList,
	MenuListItem,
	Slider,
} from "react95";
import { DialogContent, DialogRoot, DialogTrigger } from "../components/Dialog";
import { Shell } from "../components/Shell";
import { redirect } from "react-router-dom";
import { gridQueries } from "../queries";
import {useGridMutation} from "../mutations";
import { createRandomMapName } from "../utils";
import type {Grid} from "../types";

const CELL_SIZE = 18;

// const STRUCTURES_SPRITES = Object.values(
//   import.meta.glob("../../public/sprites/structures/*.{png,jpg,jpeg,svg}", {
//     eager: true,
//     as: "url",
//   })
// );
// const ZONES_SPRITES = Object.values(
//   import.meta.glob("../../public/sprites/zones/*.{png,jpg,jpeg,svg}", {
//     eager: true,
//     as: "url",
//   })
// );
const SPRITES_REST = Object.values(
	import.meta.glob("../../public/sprites/sprites/*.{png,jpg,jpeg,svg}", {
		eager: true,
		as: "url",
	}),
);


class SmallTree {
	paint(prevGrid: LocalGrid, row: number, col: number) {
		const newGrid = [...prevGrid];
		newGrid[row][col] = {
			sprite: "structures/small-tree-0.png",
		};
		newGrid[row - 1][col] = {
			sprite: "structures/small-tree-1.png",
		};
		newGrid[row - 2][col] = {
			sprite: "structures/small-tree-2.png",
		};
		return newGrid;
	}
}

class MediumTree {
	paint(prevGrid: LocalGrid, row: number, col: number) {
		const newGrid = [...prevGrid];
		newGrid[row][col] = {
			sprite: "structures/medium-tree-0-0.png",
		};
		newGrid[row][col + 1] = {
			sprite: "structures/medium-tree-1-0.png",
		};
		newGrid[row - 1][col] = {
			sprite: "structures/medium-tree-0-1.png",
		};
		newGrid[row - 1][col + 1] = {
			sprite: "structures/medium-tree-1-1.png",
		};
		newGrid[row - 2][col] = {
			sprite: "structures/medium-tree-0-2.png",
		};
		newGrid[row - 2][col + 1] = {
			sprite: "structures/medium-tree-1-2.png",
		};
		return newGrid;
	}
}

class Zone {
	type: string | null = null;

	paint(prevGrid: LocalGrid, row: number, col: number, brushSize: number) {
		if (!this.type) return prevGrid;
		const newGrid = [...prevGrid];
		for (let i = row; i <= row + brushSize - 1; i++) {
			for (let j = col; j <= col + brushSize - 1; j++) {
				if (
					i - 2 >= 0 &&
					i + 2 < newGrid.length &&
					j - 2 >= 0 &&
					j + 2 < newGrid[0].length
				) {
					newGrid[i][j] = {
						sprite: `zones/${this.type}-center.png`,
					};
					if (
						newGrid[i + 1][j]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-bottom-right.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-bottom-left.png`
					) {
						newGrid[i + 1][j] = {
							sprite: `zones/${this.type}-center-bottom.png`,
						};
					}
					if (
						newGrid[i - 1][j]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-top-right.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-top-left.png`
					) {
						newGrid[i - 1][j] = {
							sprite: `zones/${this.type}-center-top.png`,
						};
					}
					if (
						newGrid[i][j + 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-top-right.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-bottom-right.png`
					) {
						newGrid[i][j + 1] = {
							sprite: `zones/${this.type}-center-right.png`,
						};
					}
					if (
						newGrid[i][j - 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-top-left.png` &&
						newGrid[i + 1][j]?.sprite !==
							`zones/${this.type}-corner-bottom-left.png`
					) {
						newGrid[i][j - 1] = {
							sprite: `zones/${this.type}-center-left.png`,
						};
					}
					if (
						newGrid[i + 1][j + 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j + 1]?.sprite !==
							`zones/${this.type}-corner-bottom-right.png` &&
						newGrid[i + 1][j + 1]?.sprite !==
							`zones/${this.type}-center-right.png` &&
						newGrid[i + 1][j + 1]?.sprite !==
							`zones/${this.type}-center-bottom.png`
					) {
						newGrid[i + 1][j + 1] = {
							sprite: `zones/${this.type}-bottom-right.png`,
						};
					}
					if (
						newGrid[i + 1][j - 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i + 1][j - 1]?.sprite !==
							`zones/${this.type}-corner-bottom-left.png` &&
						newGrid[i + 1][j - 1]?.sprite !==
							`zones/${this.type}-center-left.png` &&
						newGrid[i + 1][j - 1]?.sprite !==
							`zones/${this.type}-center-bottom.png`
					) {
						newGrid[i + 1][j - 1] = {
							sprite: `zones/${this.type}-bottom-left.png`,
						};
					}
					if (
						newGrid[i - 1][j + 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i - 1][j + 1]?.sprite !==
							`zones/${this.type}-corner-top-right.png` &&
						newGrid[i - 1][j + 1]?.sprite !==
							`zones/${this.type}-corner-top-left.png` &&
						newGrid[i - 1][j + 1]?.sprite !==
							`zones/${this.type}-center-right.png` &&
						newGrid[i - 1][j + 1]?.sprite !==
							`zones/${this.type}-center-top.png`
					) {
						newGrid[i - 1][j + 1] = {
							sprite: `zones/${this.type}-top-right.png`,
						};
					}
					if (
						newGrid[i - 1][j - 1]?.sprite !== `zones/${this.type}-center.png` &&
						newGrid[i - 1][j - 1]?.sprite !==
							`zones/${this.type}-corner-top-right.png` &&
						newGrid[i - 1][j - 1]?.sprite !==
							`zones/${this.type}-corner-top-left.png` &&
						newGrid[i - 1][j - 1]?.sprite !==
							`zones/${this.type}-center-left.png` &&
						newGrid[i - 1][j - 1]?.sprite !==
							`zones/${this.type}-center-top.png`
					) {
						newGrid[i - 1][j - 1] = {
							sprite: `zones/${this.type}-top-left.png`,
						};
					}
					// CORNER TOP LEFT
					if (
						(newGrid[i][j - 2]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i][j - 2]?.sprite ===
								`zones/${this.type}-top-left.png`) &&
						(newGrid[i - 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 1][j - 1]?.sprite ===
								`zones/${this.type}-top-left.png`)
					) {
						newGrid[i][j - 1] = {
							sprite: `zones/${this.type}-corner-top-left.png`,
						};
					}
					if (
						(newGrid[i + 1][j - 2]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i + 1][j - 2]?.sprite ===
								`zones/${this.type}-top-left.png`) &&
						(newGrid[i - 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 1][j - 1]?.sprite ===
								`zones/${this.type}-top-left.png`)
					) {
						newGrid[i + 1][j - 1] = {
							sprite: `zones/${this.type}-corner-top-left.png`,
						};
					}

					if (
						(newGrid[i - 2][j]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 2][j]?.sprite ===
								`zones/${this.type}-top-left.png`) &&
						(newGrid[i - 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 1][j - 1]?.sprite ===
								`zones/${this.type}-top-left.png`)
					) {
						newGrid[i - 1][j] = {
							sprite: `zones/${this.type}-corner-top-left.png`,
						};
					}
					if (
						(newGrid[i - 2][j + 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 2][j + 1]?.sprite ===
								`zones/${this.type}-top-left.png`) &&
						(newGrid[i - 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i - 1][j - 1]?.sprite ===
								`zones/${this.type}-top-left.png`)
					) {
						newGrid[i - 1][j + 1] = {
							sprite: `zones/${this.type}-corner-top-left.png`,
						};
					}

					// CORNER TOP RIGHT
					if (
						(newGrid[i][j + 2]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i][j + 2]?.sprite ===
								`zones/${this.type}-top-right.png`) &&
						(newGrid[i - 1][j + 1]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i - 1][j + 1]?.sprite ===
								`zones/${this.type}-top-right.png`)
					) {
						newGrid[i][j + 1] = {
							sprite: `zones/${this.type}-corner-top-right.png`,
						};
					}
					if (
						(newGrid[i + 1][j + 2]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i + 1][j + 2]?.sprite ===
								`zones/${this.type}-top-right.png`) &&
						(newGrid[i - 1][j + 1]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i - 1][j + 1]?.sprite ===
								`zones/${this.type}-top-right.png`)
					) {
						newGrid[i + 1][j + 1] = {
							sprite: `zones/${this.type}-corner-top-right.png`,
						};
					}
					if (
						(newGrid[i - 2][j]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i - 2][j]?.sprite ===
								`zones/${this.type}-top-right.png`) &&
						(newGrid[i - 1][j + 1]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i - 1][j + 1]?.sprite ===
								`zones/${this.type}-top-right.png`)
					) {
						newGrid[i - 1][j] = {
							sprite: `zones/${this.type}-corner-top-right.png`,
						};
					}
					if (
						(newGrid[i - 2][j - 1]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i - 2][j - 1]?.sprite ===
								`zones/${this.type}-top-right.png`) &&
						(newGrid[i - 1][j + 1]?.sprite ===
							`zones/${this.type}-center-top.png` ||
							newGrid[i - 1][j + 1]?.sprite ===
								`zones/${this.type}-top-right.png`)
					) {
						newGrid[i - 1][j - 1] = {
							sprite: `zones/${this.type}-corner-top-right.png`,
						};
					}

					// CORNER BOTTOM LEFT
					if (
						(newGrid[i + 2][j]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i + 2][j]?.sprite ===
								`zones/${this.type}-bottom-left.png`) &&
						(newGrid[i + 1][j - 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j - 1]?.sprite ===
								`zones/${this.type}-bottom-left.png`)
					) {
						newGrid[i + 1][j] = {
							sprite: `zones/${this.type}-corner-bottom-left.png`,
						};
					}
					if (
						(newGrid[i + 2][j + 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i + 2][j + 1]?.sprite ===
								`zones/${this.type}-bottom-left.png`) &&
						(newGrid[i + 1][j - 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j - 1]?.sprite ===
								`zones/${this.type}-bottom-left.png`)
					) {
						newGrid[i + 1][j + 1] = {
							sprite: `zones/${this.type}-corner-bottom-left.png`,
						};
					}

					if (
						(newGrid[i + 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i + 1][j - 1]?.sprite ===
								`zones/${this.type}-bottom-left.png`) &&
						(newGrid[i][j - 2]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i][j - 2]?.sprite ===
								`zones/${this.type}-bottom-left.png`)
					) {
						newGrid[i][j - 1] = {
							sprite: `zones/${this.type}-corner-bottom-left.png`,
						};
					}
					if (
						(newGrid[i + 1][j - 1]?.sprite ===
							`zones/${this.type}-center-left.png` ||
							newGrid[i + 1][j - 1]?.sprite ===
								`zones/${this.type}-bottom-left.png`) &&
						(newGrid[i - 1][j - 2]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i - 1][j - 2]?.sprite ===
								`zones/${this.type}-bottom-left.png`)
					) {
						newGrid[i - 1][j - 1] = {
							sprite: `zones/${this.type}-corner-bottom-left.png`,
						};
					}

					// CORNER BOTTOM RIGHT
					if (
						(newGrid[i + 2][j]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i + 2][j]?.sprite ===
								`zones/${this.type}-bottom-right.png`) &&
						(newGrid[i + 1][j + 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j + 1]?.sprite ===
								`zones/${this.type}-bottom-right.png`)
					) {
						newGrid[i + 1][j] = {
							sprite: `zones/${this.type}-corner-bottom-right.png`,
						};
					}
					if (
						(newGrid[i + 2][j - 1]?.sprite ===
							`zones/${this.type}-center-right.png` ||
							newGrid[i + 2][j - 1]?.sprite ===
								`zones/${this.type}-bottom-right.png`) &&
						(newGrid[i + 1][j + 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j + 1]?.sprite ===
								`zones/${this.type}-bottom-right.png`)
					) {
						newGrid[i + 1][j - 1] = {
							sprite: `zones/${this.type}-corner-bottom-right.png`,
						};
					}

					if (
						(newGrid[i][j + 2]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i][j + 2]?.sprite ===
								`zones/${this.type}-bottom-right.png`) &&
						(newGrid[i + 1][j + 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j + 1]?.sprite ===
								`zones/${this.type}-bottom-right.png`)
					) {
						newGrid[i][j + 1] = {
							sprite: `zones/${this.type}-corner-bottom-right.png`,
						};
					}

					if (
						(newGrid[i - 1][j + 2]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i - 1][j + 2]?.sprite ===
								`zones/${this.type}-bottom-right.png`) &&
						(newGrid[i + 1][j + 1]?.sprite ===
							`zones/${this.type}-center-bottom.png` ||
							newGrid[i + 1][j + 1]?.sprite ===
								`zones/${this.type}-bottom-right.png` ||
							newGrid[i][j + 1]?.sprite ===
								`zones/${this.type}-bottom-right.png` ||
							newGrid[i][j + 1]?.sprite ===
								`zones/${this.type}-center-right.png`)
					) {
						newGrid[i - 1][j + 1] = {
							sprite: `zones/${this.type}-corner-bottom-right.png`,
						};
					}

					// FINAL CENTER
					if (
						newGrid[i - 2][j]?.sprite === `zones/${this.type}-center.png` &&
						newGrid[i][j]?.sprite === `zones/${this.type}-center.png`
					)
						newGrid[i - 1][j] = {
							sprite: `zones/${this.type}-center.png`,
						};
					if (
						newGrid[i + 2][j]?.sprite === `zones/${this.type}-center.png` &&
						newGrid[i][j]?.sprite === `zones/${this.type}-center.png`
					)
						newGrid[i + 1][j] = {
							sprite: `zones/${this.type}-center.png`,
						};
				}
			}
		}
		return newGrid;
	}
}

class Sand extends Zone {
	type = "sand";
}

class Water extends Zone {
	type = "water";
}

class Grass extends Zone {
	type = "grass";
}

type LocalGrid = Array<Array<{ sprite: string | null }>>;

function erase(prevGrid: LocalGrid, row: number, col: number, brushSize: number) {
	const newGrid = [...prevGrid];
	for (let i = row; i <= row + brushSize - 1; i++) {
		for (let j = col; j <= col + brushSize - 1; j++) {
			if (i >= 0 && i < newGrid.length && j >= 0 && j < newGrid[0].length) {
				newGrid[i][j] = {
					sprite: null,
				};
			}
		}
	}
	return newGrid;
}

function paint(
	prevGrid: LocalGrid,
	row: number,
	col: number,
	brushSize: number,
	selectedSprite: string | null,
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

type ObjType = "sprite" | "zone" | "structure";
type Obj = {
	type: ObjType;
	name: string;
};

export const loader = (queryClient: QueryClient) => async () => {
	try {
		await queryClient.ensureQueryData(gridQueries.detail(1));
		return true;
	} catch (error) {
		return redirect("/login");
	}
};

export function MapBuilder({initialGrid}: {initialGrid: Grid | null}) {
	const initialSprites = initialGrid ? JSON.parse(initialGrid.grid) : null;
    const [currentTool, setCurrentTool] = useState<"brush" | "eraser">("brush");
	const [brushSize, setBrushSize] = useState(1);
	const [selectedObj, setSelectedObj] = useState<Obj>({
		type: "sprite",
		name: "sand-center.png",
	});

	const [grid, setGrid] = useState<Array<Array<{ sprite: string | null }>>>(
		initialSprites ?? Array.from({ length: 30 }, () =>
			Array.from({ length: 30 }, () => ({
				sprite: null,
			})),
		),
	);

    const gridMutation = useGridMutation();

	const paintOnCell = (el: HTMLButtonElement) => {
		if (!el) return;
		const row = Number.parseInt(el.dataset.row as string);
		const col = Number.parseInt(el.dataset.col as string);

		if (row === undefined || col === undefined) return;

		if (currentTool === "eraser") {
			setGrid((prevGrid) => erase(prevGrid, row, col, brushSize));
		} else {
			setGrid((prevGrid) => {
				switch (selectedObj.type) {
					case "zone":
						switch (selectedObj.name) {
							case "sand":
								return new Sand().paint(prevGrid, row, col, brushSize);
							case "water":
								return new Water().paint(prevGrid, row, col, brushSize);
							case "grass":
								return new Grass().paint(prevGrid, row, col, brushSize);
							default:
								return paint(prevGrid, row, col, brushSize, selectedObj.name);
						}
					case "structure":
						switch (selectedObj.name) {
							case "small-tree":
								return new SmallTree().paint(prevGrid, row, col);
							case "medium-tree":
								return new MediumTree().paint(prevGrid, row, col);
							default:
								return paint(prevGrid, row, col, brushSize, selectedObj.name);
						}
					default:
						return paint(prevGrid, row, col, brushSize, selectedObj.name);
				}
			});
		}
	};

	const toggleSpriteOnCell = (ev: SyntheticEvent) => {
		const target = (ev.target as HTMLElement).closest(
			"button",
		) as HTMLButtonElement;

		paintOnCell(target);
	};

	const handleDrag = (ev: SyntheticEvent & { buttons: number }) => {
		const isDragging = ev.buttons > 0;
		if (!isDragging) return;

		const target = (ev.target as HTMLElement).closest(
			"button",
		) as HTMLButtonElement;

		paintOnCell(target);
	};

	return (
        <Shell>
		<div
			className="flex flex-col justify-between gap-4 items-center"
			style={{
				height: "calc(100vh - 96px)",
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
										src={`/sprites/${row.sprite}`}
										width={CELL_SIZE}
										height={CELL_SIZE}
										alt={row.sprite}
										className="pointer-events-none"
									/>
								) : null}
							</button>
						)),
					)}
				</div>
			</Frame>
			<div className="relative">
				<MenuList inline style={{ width: 800 }}>
					<MenuListItem
						as="button"
						data-zone-name="sand"
						onClick={(ev: SyntheticEvent) => {
							const target = ev.currentTarget as HTMLButtonElement;
							setCurrentTool("brush");
							setSelectedObj({
								type: "zone",
								name: target.dataset.zoneName as string,
							});
						}}
						className={cn({
							"bg-teal-600":
								selectedObj.name === "sand" && currentTool === "brush",
						})}
					>
						<img
							src={"/sprites/zones/sand-center.png"}
							alt="sand-center"
							style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
						/>
					</MenuListItem>
					<MenuListItem
						as="button"
						data-zone-name="water"
						onClick={(ev: SyntheticEvent) => {
							const target = ev.currentTarget as HTMLButtonElement;
							setCurrentTool("brush");
							setSelectedObj({
								type: "zone",
								name: target.dataset.zoneName as string,
							});
						}}
						className={cn({
							"bg-teal-600":
								selectedObj.name === "water" && currentTool === "brush",
						})}
					>
						<img
							src={"/sprites/zones/water-center.png"}
							alt="water-center"
							style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
						/>
					</MenuListItem>
					<MenuListItem
						as="button"
						data-zone-name="grass"
						onClick={(ev: SyntheticEvent) => {
							const target = ev.currentTarget as HTMLButtonElement;
							setCurrentTool("brush");
							setSelectedObj({
								type: "zone",
								name: target.dataset.zoneName as string,
							});
						}}
						className={cn({
							"bg-teal-600":
								selectedObj.name === "grass" && currentTool === "brush",
						})}
					>
						<img
							src={"/sprites/zones/grass-center.png"}
							alt="grass-center"
							style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
						/>
					</MenuListItem>
					<Handle size={38} />
					<MenuListItem
						as="button"
						data-structure-name="medium-tree"
						onClick={(ev: SyntheticEvent) => {
							const target = ev.currentTarget as HTMLButtonElement;
							setCurrentTool("brush");
							setSelectedObj({
								type: "structure",
								name: target.dataset.structureName as string,
							});
						}}
						className={cn({
							"bg-teal-600":
								selectedObj.name === "medium-tree" && currentTool === "brush",
						})}
					>
						<img
							alt="medium-tree"
							style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
							src={"/sprites/structures/medium-tree-0-1.png"}
						/>
					</MenuListItem>
					<Handle size={38} />
					<DialogRoot>
						<DialogTrigger>
							<MenuListItem as="button">All sprites</MenuListItem>
						</DialogTrigger>
						<DialogContent title="Srites">
							<div className="grid grid-cols-8 gap-1">
								{[...SPRITES_REST].map((sprite, i) => {
									const dataName = `sprites/${sprite.split("/").pop()}`;
									return (
										<MenuListItem
											key={i}
											as="button"
											data-name={dataName}
											onClick={(ev: SyntheticEvent) => {
												const target = ev.currentTarget as HTMLButtonElement;
												setCurrentTool("brush");
												setSelectedObj({
													type: "sprite",
													name: target.dataset.name as string,
												});
											}}
											className={cn({
												"bg-teal-600":
													selectedObj.name === dataName &&
													currentTool === "brush",
											})}
										>
											<img
												src={sprite}
												alt={`sprite-${i}`}
												style={{ minWidth: CELL_SIZE, height: CELL_SIZE }}
											/>
										</MenuListItem>
									);
								})}
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
						<DialogTrigger>
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
												})),
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
													})),
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
                    <MenuListItem as="button"
                    onClick={() => gridMutation.mutate({
                        id: initialGrid?.id ?? null,
                        name: createRandomMapName(),
                        grid: JSON.stringify(grid),
                    })}>
                        Save
                    </MenuListItem>
                    <MenuListItem
                        as="button"
                        onClick={() => {
                            const gridString = JSON.stringify(grid);
                            const blob = new Blob([gridString], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "map.json";
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        Export
                    </MenuListItem>
				</MenuList>
			</div>
		</div>
        </Shell>
	);
}
