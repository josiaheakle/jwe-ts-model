// Dependencies
import { Request } from "jest-express/lib/request";
import * as Express from "express";
import * as sqlite from "sqlite";
import * as sqlite3 from "sqlite3";

// Module and Module types
import { Model } from "../Model";
import { ModelProperty } from "../types/ModelTypes";

const Helpers = (() => {
	const prop: ModelProperty = {
		name: "testProp",
		column: "test_number",
		rules: [
			{
				rule: "maxNum",
				param: 10,
			},
			{ rule: "required" },
		],
	};

	class TestModel extends Model {
		tableName = "test";
		properties = [prop];
	}

	const createConnection = async (): Promise<sqlite.Database> => {
		return await sqlite.open({
			filename: "./test.db",
			driver: sqlite3.Database,
		});
	};

	return {
		prop,
		TestModel,
		createConnection,
	};
})();

test("maxNum passes", async () => {
	const req = new Request();
	req.setBody({
		testProp: 1,
	});

	const conn = await Helpers.createConnection();
	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);
	await conn.close();

	expect(await model.checkRules()).toBe(true);
});

test("maxNum passes on last number", async () => {
	const req = new Request();
	req.setBody({
		testProp: 10,
	});

	const conn = await Helpers.createConnection();
	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);
	await conn.close();

	expect(await model.checkRules()).toBe(true);
});

test("maxNum fails too high", async () => {
	const req = new Request();
	req.setBody({
		testProp: 11,
	});

	const conn = await Helpers.createConnection();
	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);
	await conn.close();

	expect(await model.checkRules()).toBe(false);
});

test("maxNum fails not a number", async () => {
	const req = new Request();
	req.setBody({
		testProp: "string",
	});

	const conn = await Helpers.createConnection();
	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);
	await conn.close();

	expect(await model.checkRules()).toBe(false);
});

test("save data returns id of created entry", async () => {
	const req = new Request();

	req.setBody({
		testProp: 1,
	});

	const conn = await Helpers.createConnection();

	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);

	expect(await model.saveData()).toBeGreaterThanOrEqual(0);
	await conn.close();
});

test("check rules is false if missing property", async () => {
	const req = new Request();

	req.setBody({
		missingProp: "asdf",
	});

	const conn = await Helpers.createConnection();

	const model = new Helpers.TestModel(conn);
	model.loadBody(req as unknown as Express.Request);

	expect(await model.checkRules()).toBe(false);
	await conn.close();
});
