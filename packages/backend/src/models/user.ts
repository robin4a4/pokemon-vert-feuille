import { type JSONSchema, Model } from "objection";
import { Base } from "./base";

export class User extends Base {
	username!: string;
	password!: string;
	salt!: string;

	static override tableName = "users";
	static override get jsonSchema() {
		const base = Base.jsonSchema;
		return {
			...base,
			required: ["username", "password", "salt"],
			properties: {
				...base.properties,
				username: { type: "string", minLength: 1, maxLength: 255 },
				password: { type: "string", minLength: 1, maxLength: 255 },
				salt: { type: "string", minLength: 1, maxLength: 255 },
			},
		} satisfies JSONSchema;
	}

	static override get relationMappings() {
        const gridModule = require("./grid");
        return {
            grids: {
                relation: Model.HasManyRelation,
                modelClass: gridModule.Grid,
                join: {
                    from: "users.id",
                    to: "grids.userId",
                },
		    },
        }
	};
}
