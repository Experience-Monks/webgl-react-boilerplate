import { getQueryFromParams } from "./utils/query-params";

const settings = {};

settings.isDevelopment = process.env.NODE_ENV !== "production";
settings.stats = getQueryFromParams("stats") === null && settings.isDevelopment;
settings.devCamera = getQueryFromParams("devCamera") === "true" && settings.isDevelopment;
settings.helpers = getQueryFromParams("helpers") === "true" && settings.isDevelopment;
settings.datGui = getQueryFromParams("gui") === null && settings.isDevelopment;

export default settings;
