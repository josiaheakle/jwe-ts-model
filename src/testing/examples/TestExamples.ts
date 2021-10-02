// module and types
import { ModelProperty, Model } from "../..";

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
	column: "required_column",
	rules: [
		{
			rule: "required",
		},
	],
};

export { TestModel, numProp, strProp, emailProp, uniqueProp, requiredProp };
