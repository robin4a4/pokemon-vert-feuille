import { Model } from "objection";

export class User extends Model {
    id!: number;
    username!: string;
    password!: string;

    static override tableName = "users";
}

export class Grid extends Model {
    id!: number;
    name!: string;
    grid!: string;
    userId!: number;

    static override tableName = "grids";
}
