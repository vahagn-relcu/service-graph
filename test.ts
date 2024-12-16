import { database } from "./interfaces";
import exampleCom from "./modules/example-com";

console.log(exampleCom.toGraph().toJSON())

// exampleCom.start().then((app) => app.get(database)).then(console.log)
