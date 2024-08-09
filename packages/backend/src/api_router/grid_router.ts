import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { z } from "zod";
import { Grid } from "../models";
import { validateSuccessResponse, validateErrorResponse } from "shared/validator";
import { authenticateJwt, Logger } from "../utils";
import { GridSchema, GridsSchema } from "shared/schema";

const logger = new Logger("gridRouter");

const gridRouter = Router();
gridRouter.use(authenticateJwt)

const GridBodySchema = z.object({
	grid: z.string(),
	username: z.string(),
});

gridRouter
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const grids = await Grid.query().where("userId", req.user.id);
			res.json(validateSuccessResponse({ status: "success", data: grids.map(grid => {
                return {
                    id: grid.id,
                    name: grid.name,
                    grid: grid.grid,
                    userId: grid.userId,
                    createdAt: grid.created_at,
                    updatedAt: grid.updated_at,
                };
            }) }, GridsSchema));
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
	.post((req: Request, res: Response, next: NextFunction) => {
		const { username, grid } = GridBodySchema.parse(req.body);
		Grid.query()
			.insert({
				username,
				grid,
			} as unknown as PartialModelObject<Grid>)
			.then((grid) => {
				res.json(validateSuccessResponse({ status: "success", data: {
                    id: grid.id,
                    name: grid.name,
                    grid: grid.grid,
                    userId: grid.userId,
                    createdAt: grid.created_at,
                    updatedAt: grid.updated_at,
                } }, GridSchema));
			})
			.catch((err) => {
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
			res.json(validateSuccessResponse({ status: "success", data: {
                id: grid.id,
                name: grid.name,
                grid: grid.grid,
                userId: grid.userId,
                createdAt: grid.created_at,
                updatedAt: grid.updated_at,
            } }, GridSchema));
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
		const { username, grid } = GridBodySchema.parse(req.body);
		Grid.query()
			.findById(gridId)
			.patch({
				username,
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
