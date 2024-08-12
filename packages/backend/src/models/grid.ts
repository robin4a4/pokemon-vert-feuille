import { type JSONSchema, Model } from "objection";

import { Base } from "./base";
import { User } from "./user";

export class Grid extends Base {
	name!: string;
	grid!: string;
	userId!: number;

	static override tableName = "grids";

	static override get jsonSchema() {
		const base = Base.jsonSchema;
		return {
			...base,
			required: ["name", "grid"],
			properties: {
				...base.properties,
				name: { type: "string", minLength: 1, maxLength: 255 },
				grid: { type: "string", minLength: 1 },
				userId: { type: "integer" },
			},
		} satisfies JSONSchema;
	}

	static override relationMappings = {
		user: {
			relation: Model.BelongsToOneRelation,
			modelClass: User,
			join: {
				from: "grids.userId",
				to: "users.id",
			},
		},
	};
}
