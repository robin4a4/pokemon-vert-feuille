import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MapBuilder } from "../components/MapBuilder";
import { gridQueries } from "../queries";

export function NewMapBuilderRoute() {
    return <MapBuilder initialGrid={null} />
}

export function ExistingMapBuilderRoute({gridId}: {gridId: number}) {
    const {data: grid} = useSuspenseQuery(gridQueries.detail(gridId))
    return <MapBuilder initialGrid={grid} />
}

export function MapBuilderRoute() {
    const {gridId} = useParams()
    return gridId ? <ExistingMapBuilderRoute gridId={Number.parseInt(gridId)} /> : <NewMapBuilderRoute />
}
