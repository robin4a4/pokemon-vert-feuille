import type { Grid, LocalGrid } from "../types";

export function Thumbnail({ grid }: { grid: Grid["grid"] }) {
    const parsedGrid = JSON.parse(grid) as LocalGrid
    return <div
    className="grid"
    style={{
        gridTemplateColumns: `repeat(${parsedGrid.length}, 1fr)`,
    }}
>
    {parsedGrid.map((col, i) =>
        col.map((row, j) => (
            <div
                key={`${i}-${j}`}
                style={{
                    width: "auto",
                    height: "auto",
                }}
            >
                <img
                    src={`/sprites/${row.sprite}`}
                    alt=""
                    style={{
                        width: "auto",
                        height: "auto",
                        border: "none"
                    }}
                    />
                </div>
        ))
    )}
    </div>;
}
