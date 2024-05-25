import pino from "pino"
//pino acts as a logger for keeping tract

export const logger =pino({
    level:"debug",
    transport:{
        target:"pino-pretty",
    },
});