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
	generateUUID,
} from "./TestExamples";

test(`{generateUUID} properly generates unique value`, () => {
	const uuid = generateUUID(5);
	expect(uuid.length).toBe(5);
});
