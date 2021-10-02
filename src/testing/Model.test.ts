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
} from "./examples/TestExamples";

import {
	createRequest,
	createConnection,
	genUUID,
} from "./methods/TestMethods";

test("{saveData} returns id of saved column", async () => {
	const req = createRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: genUUID(10),
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req);
	const saveData = await model.saveData();
	expect(saveData).toBeGreaterThanOrEqual(0);
	await conn.close();
});

test("{saveData} id gets incremented", async () => {
	const req1 = createRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: genUUID(10),
	});
	const req2 = createRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: genUUID(10),
	});
	const req3 = createRequest({
		requiredProperty: "value",
		numberProperty: 12,
		stringProperty: "string",
		emailProperty: "test@email.com",
		uniqueProperty: genUUID(10),
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

test("{saveData && getColumnById} id matches data returned by getColumnById", async () => {
	const str = `value`;
	const unique1 = genUUID(10);
	const req1 = createRequest({
		requiredProperty: `${str}1`,
		numberProperty: 1,
		stringProperty: `${str}1`,
		emailProperty: `${str}1@email.com`,
		uniqueProperty: unique1,
	});
	const conn = await createConnection();
	const model = new TestModel(conn);
	model.loadBody(req1);
	const saveId1 = await model.saveData();
	const saveData1 = await model.getColumnById(saveId1);
	expect(saveData1).toMatchObject({
		id: saveId1,
		required_column: `${str}1`,
		number_column: 1,
		string_column: `${str}1`,
		email_column: `${str}1@email.com`,
		unique_column: unique1,
	});
});

// test("{saveData} saves data", async () => {});
