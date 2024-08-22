import { type JSONSchema, Model } from "objection";

import { Base } from "./base";

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

	static override get relationMappings() {
        const userModule = require("./user");
            return {
                user: {
                relation: Model.BelongsToOneRelation,
                modelClass: userModule.User,
                join: {
                    from: "grids.userId",
                    to: "users.id",
                },
            },
        };
    }
}
