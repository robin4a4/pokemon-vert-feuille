import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { GridSchema, GridsSchema } from "shared/schema";
import { validateErrorResponse, validateSuccessResponse } from "shared/validator";
import { z } from "zod";
import { Grid } from "../models/grid";
import { User } from "../models/user";
import { Logger, authenticateJwt } from "../utils";

const logger = new Logger("gridRouter");

const gridRouter = Router();
gridRouter.use(authenticateJwt);

const GridBodySchema = z.object({
	name: z.string(),
	grid: z.string(),
});

gridRouter
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user) {
				res.status(StatusCodes.UNAUTHORIZED).json(validateErrorResponse({ status: "error", error: "Unauthorized" }));
				return;
			}
			const grids = await Grid.query().where("userId", user.id);
			res.json(
				validateSuccessResponse(
					{
						status: "success",
						data: grids.map((grid) => {
							return {
								id: grid.id,
								name: grid.name,
								grid: grid.grid,
								userId: grid.userId,
								createdAt: grid.created_at,
								updatedAt: grid.updated_at,
							};
						}),
					},
					GridsSchema,
				),
			);
		} catch (e) {
			logger.error(`Error getting grids: ${e}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateErrorResponse({
					status: "error",
					error: (e as Error).message,
				}),
			);
		}
	})
	.post((req: Request, res: Response) => {
		const user = req.user;
		if (!user) {
			res.status(StatusCodes.UNAUTHORIZED).json(validateErrorResponse({ status: "error", error: "Unauthorized" }));
			return;
		}
		const { name, grid } = GridBodySchema.parse(req.body);
		User.relatedQuery("grids")
			.for(user.id)
			.insert({
				name,
				grid,
			})
			.then((grid) => {
				if (!(grid instanceof Grid)) throw new Error("Error creating grid");
				logger.info(`Grid created: ${grid.id}`);
				console.log(grid.id, grid.name, grid.created_at, grid.updated_at);
				res.json(
					validateSuccessResponse(
						{
							status: "success",
							data: {
								id: grid.id,
								name: grid.name,
								grid: grid.grid,
								userId: grid.userId,
								createdAt: grid.created_at,
								updatedAt: grid.updated_at,
							},
						},
						GridSchema,
					),
				);
			})
			.catch((err) => {
				logger.error(`Error creating grid: ${err}`);
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateErrorResponse({ status: "error", error: (err as Error).message }));
			});
	});

const GridParamsSchema = z
	.object({
		id: z.string(),
	})
	.transform((params) => {
		return { id: Number.parseInt(params.id) };
	});

gridRouter
	.route("/:id")
	.get(async (req: Request, res: Response) => {
		try {
			const gridId = GridParamsSchema.parse(req.params).id;
			const grid = await Grid.query().findById(gridId);
			if (!grid) {
				res.status(StatusCodes.NOT_FOUND).json(validateErrorResponse({ status: "error", error: "Grid not found" }));
				return;
			}
			res.json(
				validateSuccessResponse(
					{
						status: "success",
						data: {
							id: grid.id,
							name: grid.name,
							grid: grid.grid,
							userId: grid.userId,
							createdAt: grid.created_at,
							updatedAt: grid.updated_at,
						},
					},
					GridSchema,
				),
			);
		} catch (e) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateErrorResponse({
					status: "error",
					error: (e as Error).message,
				}),
			);
		}
	})
	.put(async (req: Request, res: Response, next: NextFunction) => {
		const gridId = GridParamsSchema.parse(req.params).id;
		const { grid } = GridBodySchema.parse(req.body);
		Grid.query()
			.findById(gridId)
			.patch({
				grid,
			} as unknown as PartialModelObject<Grid>)
			.then((grid) => {
				res.json(validateSuccessResponse({ status: "success", data: {} }, z.object({})));
			})
			.catch((err) => {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateErrorResponse({ status: "error", error: (err as Error).message }));
			});
	});

export { gridRouter };
