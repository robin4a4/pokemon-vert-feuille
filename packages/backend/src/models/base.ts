import { type JSONSchema, Model, type ModelOptions, type QueryContext } from "objection";

export class Base extends Model {
	id!: number;
	created_at!: string;
	updated_at!: string;

	static override jsonSchema = {
		type: "object",
		properties: {
			id: { type: "integer" },
			created_at: { type: "string", format: "date-time" },
			updated_at: { type: "string", format: "date-time" },
		},
	} satisfies JSONSchema;

	// Update the timestamp before updating a record
	override async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
		super.$beforeUpdate(opt, queryContext);
		this.updated_at = new Date().toDateString();
    }
}
