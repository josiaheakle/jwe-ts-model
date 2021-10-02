// Dependencies
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

test("{saveData} returns id of saved column", async () => {
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
	const saveData = await model.saveData();
	expect(saveData).toBeGreaterThanOrEqual(0);
	await conn.close();
});

test("{saveData} id gets incremented", async () => {
	const req1 = getRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const req2 = getRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const req3 = getRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProp: Math.floor(Math.random() * 1000000),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req1);
	const saveData1 = await model.saveData();
	model.loadBody(req2);
	const saveData2 = await model.saveData();
	model.loadBody(req3);
	const saveData3 = await model.saveData();
	expect(saveData1 === saveData2 - 1 && saveData2 === saveData3 - 1).toBe(true);
	await conn.close();
});

// test("{saveData} saves data", async () => {});
