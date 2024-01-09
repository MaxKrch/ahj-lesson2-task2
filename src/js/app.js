import Sorting from "./sorting";
import list from "../database.json";
import "../index.html";

const listJSON = JSON.stringify(list);

new Sorting("#app", listJSON);
