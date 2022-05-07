const fs = require('fs');
var filePath = "./variables.json";

var vars = fs.readFileSync(filePath);
vars = JSON.parse(vars);


class Variables {
	constructor() {

	}

get(key)  {
        return vars[key];
}
	

}

const _v = new Variables();

module.exports = _v;
