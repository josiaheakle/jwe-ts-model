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
	getRequest,
	createConnection,
} from "./TestExamples";

test("All rules pass 01.", async () => {
	const req = getRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(true);
	await conn.close();
});

test("All rules pass 02.", async () => {
	const req = getRequest({
		requiredProperty: "value",
		numberProperty: -12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(true);
	await conn.close();
});

test("Rule {maxNum} fails 01.", async () => {
	const req = getRequest({
		requiredProperty: "value",
		numberProperty: -22,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(false);
	await conn.close();
});

test("Rule {maxNum} fails 02.", async () => {
	const req = getRequest({
		requiredProperty: "value",
		numberProperty: 22,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	expect(await model.checkRules()).toBe(false);
	await conn.close();
});
