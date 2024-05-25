import { applicationRoutes } from "../modules/application/application.routes";
import { userRoutes } from "../modules/users/users.routes";
import { logger } from "./logger";

const fastify= require("fastify")


//build server in a different file for ease of testing
export async function serverBuild(){ 
    const app=fastify({
        logger:logger,
    });

    //connecting to the registered routes
    app.register(applicationRoutes,{prefix: '/api/applications'})
    app.register(userRoutes,{prefix:"api/users"})

    return app;
}