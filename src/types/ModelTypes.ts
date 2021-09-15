
interface ModelRule {
	rule: string; // rule must match rules set in checkRule
	param?: any; // if rule needs additional param (eg. match/min) add here
	message?: string; // return message if any
	method?: (prop: ModelProperty, param?: any) => boolean; // set custom rule method as this, be sure to call this.addError for broken rules
}

interface ModelProperty {
	name: string;
	column?: string; // column name associated to db
	rules?: Array<ModelRule>; // array of ModelRule to check when checkRules is called
	value?: string | number | boolean; // value to be injected from request body
}

interface ModelRuleResponse {
	property?: string; // property associated with rule
	message: string; // rule message
}

export {
    ModelRule,
    ModelProperty,
    ModelRuleResponse
}