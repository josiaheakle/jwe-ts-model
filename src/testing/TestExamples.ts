// module and types
import { ModelProperty, Model } from "..";
// dependencies
import * as sqlite from "sqlite";
import * as sqlite3 from "sqlite3";
import { Request } from "jest-express/lib/request";
import * as Express from "express";

class TestModel extends Model {
	tableName = "test";
	properties = [numProp, strProp, uniqueProp, emailProp, requiredProp];
}

const numProp: ModelProperty = {
	name: "numberProperty",
	column: "number_column",
	rules: [
		{
			rule: "maxNum",
			param: 20,
		},
		{
			rule: "minNum",
			param: -20,
		},
	],
};

const strProp: ModelProperty = {
	name: "stringProperty",
	column: "string_column",
	rules: [
		{
			rule: "maxLength",
			param: 20,
		},
		{
			rule: "minLength",
			param: 2,
		},
	],
};

const emailProp: ModelProperty = {
	name: "emailProperty",
	column: "email_column",
	rules: [
		{
			rule: "isEmail",
		},
	],
};

const uniqueProp: ModelProperty = {
	name: "uniqueProperty",
	column: "unique_column",
	rules: [
		{
			rule: "unique",
		},
	],
};

const requiredProp: ModelProperty = {
	name: "requiredProperty",
	column: "unique_column",
	rules: [
		{
			rule: "required",
		},
	],
};

const getRequest = (
	body: {},
	url?: string | null | undefined
): Express.Request => {
	const req = new Request(url);
	req.setBody(body);
	const request = req as unknown as Express.Request; // to handle typeing issues with test request
	return request;
};

const createConnection = async (): Promise<sqlite.Database> => {
	return await sqlite.open({
		filename: "./test.db",
		driver: sqlite3.Database,
	});
};

export {
	getRequest,
	createConnection,
	TestModel,
	numProp,
	strProp,
	emailProp,
	uniqueProp,
	requiredProp,
};
