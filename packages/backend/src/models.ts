import { type JSONSchema, Model } from "objection";

class Base extends Model {
	id!: number;
	created_at!: Date;
	updated_at!: Date;

	static override jsonSchema = {
		type: "object",
		required: ["created_at", "updated_at"],
		properties: {
			id: { type: "integer" },
			created_at: { type: "string", format: "date-time" },
			updated_at: { type: "string", format: "date-time" },
		},
	} satisfies JSONSchema;
}

export class User extends Base {
	username!: string;
	password!: string;
	salt!: string;

	static override tableName = "users";
	static override get jsonSchema() {
		const base = super.jsonSchema;
		return {
			...base,
			required: [...base.required, "username", "password", "salt"],
			properties: {
				...base.properties,
				username: { type: "string", minLength: 1, maxLength: 255 },
				password: { type: "string", minLength: 1, maxLength: 255 },
				salt: { type: "string", minLength: 1, maxLength: 255 },
			},
		} satisfies JSONSchema;
	}
}

export class Grid extends Base {
	name!: string;
	grid!: string;
	userId!: number;

	static override tableName = "grids";

	static override get jsonSchema() {
		const base = super.jsonSchema;
		return {
			...base,
			required: [...base.required, "name", "grid", "userId"],
			properties: {
				...base.properties,
				name: { type: "string", minLength: 1, maxLength: 255 },
				grid: { type: "string", minLength: 1, maxLength: 255 },
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
