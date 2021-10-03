import {
	createRequest,
	createConnection,
	genUUID,
} from "./methods/TestMethods";

test(`{genUUID} properly generates random value`, () => {
	const uuid = genUUID(5);
	expect(uuid.length).toBe(5);
});
