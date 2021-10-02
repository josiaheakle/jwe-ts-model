import * as Express from "express";

import { Model } from "..";

// Test Examples
import {
	TestModel,
	numProp,
	strProp,
	emailProp,
	uniqueProp,
	requiredProp,
	createRequest,
	createConnection,
} from "./TestExamples";

test("All rules pass 01.", async () => {
	const req = createRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(true);
	await conn.close();
});

test("All rules pass 02.", async () => {
	const req = createRequest({
		requiredProperty: "value",
		numberProperty: -12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(true);
	await conn.close();
});

test("Rule {maxNum} fails 01.", async () => {
	const req = createRequest({
		requiredProperty: "value",
		numberProperty: -22,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(false);
	await conn.close();
});

test("Rule {maxNum} fails 02.", async () => {
	const req = createRequest({
		requiredProperty: "value",
		numberProperty: 22,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(false);
	await conn.close();
});
