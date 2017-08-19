let env = process.env.NODE_ENV || "development";

if( env === "test" || env === "development"){
	 const configJson = require('./config.json');
	 let envVar = configJson[env];
	Object.keys(envVar).map(key=>{
		process.env[key] = envVar[key];
	})
}

