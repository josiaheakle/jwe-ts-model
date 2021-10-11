# Typescript Model

Abstract model class for easy model creation, currently works with sqlite.

## Usage

---

To create model, simply extend from the Model class, with array of properties for the model to manage, in addition to the table name associated in the database.

```
import { Model } from 'ts-jwe-model';

class ExampleModel extends Model {
	tableName = "example_table";
	properties = [
		{
			name: "firstName",
			column: "first_name",
			rules: [
				{
				    rule: 'required',
				    message: 'Add a custom message here.'
				},
			],
		},
		{
			name: "lastName",
			column: "last_name",
			rules: [
				{
					rule: "required",
					message: 'Add a custom message here.'
				},
			],
		},
		{
			name: "email",
			column: "email",
			rules: [{ rule: "unique" }, { rule: "isEmail" }],
		},
		{
			name: "password",
			column: "password",
			rules: [
				{
					rule: "maxLength",
					param: 20,
				},
				{
					rule: "minLength",
					param: 6,
				},
				{
					rule: "containsSpecChar",
				},
				{
					rule: "containsCapital",
				},
			],
		},
	];

    /** Create method to handle all model logic for your usecase */

	public async registerUser(
		req: Express.Request
	) {
		this.loadBody(req);
		const rulesPassed = await this.checkRules();
		if (rulesPassed) {
            /* be sure to hash any password before saving */
			this.saveData();
		} else {
			return this.getErrorResponse();
		}
	}
}

```

## Rules

---

- **maxLength** checks if string length is less than or equal to specified number
- **minLength** checks if string length is greater than or equal to speicified number
- **maxNum** checks if number is less than or equal to specified number
- **minNum** checks if number is greater than or equal to specified number
- **matches** checks if property value matches specified property
- **unique** checks db if property value is unique
- **containsCapital** checks if value is string and if it contains a capital letter
- **containsSpecChar** checks if value is string and if it contains a special character
- **containsNumber** checks if value is string and if it contains a number
- **includes** checks if value is string and if it contains specified value inside
- **noSpaces** checks if value is string and if it contains no whitespace
- **required** checks if value is not undefined or an empty string

## In Progress

- Functionality for multiple database connections and types.
