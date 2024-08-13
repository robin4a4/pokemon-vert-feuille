import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect, useNavigate } from "react-router-dom";
import { Shell } from "../components/Shell";
import { gridQueries } from "../queries";
import { Button, Frame } from "react95";
import { AppRoute } from "../consts";

export const loader = (queryClient: QueryClient) => async () => {
	try {
		await queryClient.ensureQueryData(gridQueries.list());
		return true;
	} catch (error) {
		return redirect("/login");
	}
};

export function DashboardRoute() {
    const navigate = useNavigate();
	const { data: grids } = useSuspenseQuery(gridQueries.list());
	return (
		<Shell>
			<h1 style={{
                fontSize: 24,
            }}>Dashboard</h1>
			{grids.length === 0 ? (
                <Frame
                      variant='outside'
                      shadow
                      style={{ padding: '0.5rem', lineHeight: '1.5', width: 600, textAlign: 'center', display: "block", margin: "auto", marginTop: 16 }}
                    >
				<p className="!my-16">No grids found</p>
                <Button fullWidth onClick={() => navigate(AppRoute.MAP_BUILDER)}>Create a grid</Button>
                </Frame>
			) : (
				<ul className="flex items-center gap-4 !mt-16">
					{grids.map((grid) => (
						<li key={grid.id}>
                            <Frame style={{
                                padding: 16,
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {grid.name}
                                <Button type="button" fullWidth onClick={() => navigate(`${AppRoute.MAP_BUILDER}/${grid.id}`)}>Open</Button>
                            </Frame>
						</li>
					))}
				</ul>
			)}
		</Shell>
	);
}
