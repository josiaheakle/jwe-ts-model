// dependencies
import * as sqlite from "sqlite";
import * as sqlite3 from "sqlite3";
import { Request } from "jest-express/lib/request";
import * as Express from "express";

const createRequest = (
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

const genUUID = (length: number): string => {
	const validChars = `abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
	let uuid = ``;
	for (let i = 0; i < length; i++) {
		uuid += validChars.charAt(Math.floor(Math.random() * validChars.length));
	}
	return uuid;
};

export { createRequest, createConnection, genUUID };
