import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { z } from "zod";
import { Grid } from "../models";
import { validateResponse } from "./validator";
import { Logger } from "../utils";

const logger = new Logger("gridRouter");

const gridRouter = Router();

const GridBodySchema = z.object({
	grid: z.string(),
	username: z.string(),
});

gridRouter
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const grids = await Grid.query();
			res.json(validateResponse({ status: "success", data: grids }));
		} catch (e) {
            logger.error(`Error getting grids: ${e}`);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateResponse({
					status: "error",
					error: JSON.stringify((e as any).errors),
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
				res.json(validateResponse({ status: "success", data: grid }));
			})
			.catch((err) => {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateResponse({ status: "error", error: err.toString() }));
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
				res.status(StatusCodes.NOT_FOUND).json(validateResponse({ status: "error", error: "Grid not found" }));
				return;
			}
			res.json(validateResponse({ status: "success", data: grid }));
		} catch (e) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateResponse({
					status: "error",
					error: (e as any).errors.toString(),
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
				res.json(validateResponse({ status: "success", data: grid }));
			})
			.catch((err) => {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateResponse({ status: "error", error: err.toString() }));
			});
	});

export { gridRouter };
