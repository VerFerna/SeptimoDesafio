import handlebars from "express-handlebars";
import { isEmptyArray } from "../helpers/utils.js";
import { isSessionStarted } from "../helpers/utils.js";


const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    isEmptyArray: isEmptyArray,
    isSessionStarted: isSessionStarted,
  },
});

export default hbs;
