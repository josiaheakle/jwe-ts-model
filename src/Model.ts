import * as Express from "express";
import * as sqlite from "sqlite";

import { ModelProperty, ModelRuleResponse } from "./types/ModelTypes";

/**
 * REQUIRES tableName and properties property, must pass sqlite db connection as arg
 *
 *
 * RULES :
 * {maxLength} (param: number) checks if string length is less than or equal to specified number
 * {minLength} (param: number) checks if string length is greater than or equal to speicified number
 * {maxNum} (param: number) checks if number is less than or equal to specified number
 * {minNum} (param: number) checks if number is greater than or equal to specified number
 * {matches} (param: string of property name) checks if property value matches specified property
 * {unique} (param: none) checks db if property value is unique
 * {containsCapital} (param: none) checks if value is string and if it contains a capital letter
 * {containsSpecChar} (param: none) checks if value is string and if it contains a special character
 * {containsNumber} (param: none) checks if value is string and if it contains a number
 * {includes} (param: string) checks if value is string and if it contains specified value inside
 * {noSpaces} (param: none)  checks if value is string and if it contains no whitespace
 * {required} (param: none)  checks if value is not undefined or an empty string
 */

abstract class Model {
	abstract tableName: string; // name of table associated to db
	abstract properties: Array<ModelProperty>; // array of properties to be used

	private dbConn: sqlite.Database;

	constructor(connection: sqlite.Database) {
		this.dbConn = connection;
	}

	protected errorMessages: Array<ModelRuleResponse> = [];

	protected ruleMethods: {
		[index: string]: (prop: ModelProperty, param?: any) => Promise<boolean>;
	} = {
		required: async (prop: ModelProperty): Promise<boolean> => {
			if (
				prop.value === undefined ||
				(typeof prop.value === "string" && prop.value.length <= 1)
			) {
				this.addError({
					property: prop.name,
					message: "Required.",
				});
				false;
			}
			return true;
		},
		noSpaces: async (prop: ModelProperty): Promise<boolean> => {
			if (typeof prop.value !== "string" || prop.value.indexOf(" ") >= 0) {
				this.addError({
					property: prop.name,
					message: `Must not contain any spaces.`,
				});
				return false;
			} else return true;
		},
		containsNumber: async (prop: ModelProperty): Promise<boolean> => {
			if (typeof prop.value !== "string" || !/[0-9]/.test(prop.value)) {
				this.addError({
					property: prop.name,
					message: `Must include a number.`,
				});
				return false;
			} else return true;
		},
		containsCapital: async (prop: ModelProperty): Promise<boolean> => {
			if (typeof prop.value !== "string" || !/[A-Z]/.test(prop.value)) {
				this.addError({
					property: prop.name,
					message: `Must include a capital letter.`,
				});
				return false;
			} else return true;
		},
		containsSpecChar: async (prop: ModelProperty): Promise<boolean> => {
			if (
				typeof prop.value !== "string" ||
				!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(prop.value)
			) {
				this.addError({
					property: prop.name,
					message: `Must include a special character.`,
				});
				return false;
			} else return true;
		},
		includes: async (
			prop: ModelProperty,
			includes: string
		): Promise<boolean> => {
			if (typeof prop.value !== "string" || !prop.value.includes(includes)) {
				this.addError({
					property: prop.name,
					message: `Must include ${includes}.`,
				});
				return false;
			} else return true;
		},
		maxLength: async (prop: ModelProperty, max: number): Promise<boolean> => {
			if (typeof prop.value !== "string" || prop.value.length > max) {
				this.addError({
					property: prop.name,
					message: `Must be less than or equal to ${max} characters.`,
				});
				return false;
			} else return true;
		},
		minLength: async (prop: ModelProperty, min: number): Promise<boolean> => {
			if (typeof prop.value !== "string" || prop.value.length < min) {
				this.addError({
					property: prop.name,
					message: `Must be at least ${min} characters.`,
				});
				return false;
			} else return true;
		},
		maxNum: async (prop: ModelProperty, max: number): Promise<boolean> => {
			if (typeof prop.value !== "number" || prop.value > max) {
				this.addError({
					property: prop.name,
					message: `Must be less than or equal to ${max}.`,
				});
				return false;
			} else return true;
		},
		minNum: async (prop: ModelProperty, min: number): Promise<boolean> => {
			if (typeof prop.value !== "number" || prop.value < min) {
				this.addError({
					property: prop.name,
					message: `Must be at least ${min}.`,
				});
				return false;
			} else return true;
		},
		matches: async (
			prop: ModelProperty,
			matchProp: string
		): Promise<boolean> => {
			const matchProperty = this.getPropertyByName(matchProp);
			if (!matchProperty) {
				this.addError({
					property: prop.name,
					message: `Cannot find matching property.`,
				});
				return false;
			} else if (prop.value !== matchProperty.value) {
				this.addError({
					property: prop.name,
					message: `Must match ${matchProp}.`,
				});
				return false;
			} else return true;
		},
		unique: async (prop: ModelProperty): Promise<boolean> => {
			const SQL = `SELECT * FROM ${this.tableName} WHERE ${prop.column} = ? `;
			const res = await this.dbConn.get(SQL, prop.value);
			if (res) {
				this.addError({
					property: prop.name,
					message: `Already in use.`,
				});
				return false;
			} else return true;
		},
		isEmail: async (prop: ModelProperty): Promise<boolean> => {
			let isEmail = true;
			const emailRegEx =
				/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
			if (typeof prop.value !== "string") isEmail = false;
			else isEmail = emailRegEx.test(prop.value);
			if (!isEmail) {
				this.addError({
					property: prop.name,
					message: `Must be a valid email.`,
				});
				return false;
			} else return true;
		},
	};

	private addError(errorMessage: ModelRuleResponse) {
		this.errorMessages.push(errorMessage);
	}

	/** Returns property by name of property */
	protected getPropertyByName(name: string): ModelProperty | undefined {
		return this.properties.find((prop) => prop.name === name);
	}

	public getErrorResponse(): { [index: string]: Array<string> } {
		const obj: { [index: string]: any } = {};
		this.errorMessages.forEach((error) => {
			if (error.property) {
				if (!obj[error.property]) {
					obj[error.property] = [error.message];
				} else {
					obj[error.property].push(error.message);
				}
			}
		});
		return obj;
	}

	/** Loops through properties and checks each rule, returns true if all properties follow rules */
	public async checkRules(): Promise<boolean> {
		this.errorMessages = [];
		let isValid = true;
		for (const prop of this.properties) {
			if (prop.rules) {
				for (const rule of prop.rules) {
					try {
						const passesRule = await this.ruleMethods[rule.rule](
							prop,
							rule.param
						);
						if (!passesRule) isValid = false;
					} catch (error) {
						console.error(error);
						throw new Error(
							`Rule not found. For property ${prop.name} rule ${rule.rule}.`
						);
					}
				}
			}
		}
		return isValid;
	}

	/** Loads propety values with request body */
	public loadBody(req: Express.Request) {
		this.properties.forEach((prop) => {
			if (req.body[prop.name]) {
				prop.value = req.body[prop.name];
			}
		});
	}

	/** Saves data from this.properties into database */
	public async saveData(): Promise<number> {
		const columnStr = this.properties.map((prop) => prop.column).join(`, `);
		const SQL = `INSERT INTO ${
			this.tableName
		} (${columnStr}) VALUES (?${`, ?`.repeat(this.properties.length - 1)})`;
		try {
			const stmt = await this.dbConn.prepare(SQL);
			const res = await stmt.run(this.properties.map((prop) => prop.value));
			await stmt.finalize();
			return res.lastID || -1;
		} catch (error) {
			console.error(error);
			return -2;
		}
	}

	public async getColumnById(id: number, columns?: Array<string>): Promise<{}> {
		const columnStr = columns ? columns.join(", ") : "* ";
		const SQL = `SELECT ${columnStr} FROM ${this.tableName} WHERE id=?`;
		const res = await this.dbConn.get(SQL, id);
		return res;
	}
}

export { Model };
