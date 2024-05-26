import { applicationRoutes } from "../modules/application/application.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import { userRoutes } from "../modules/users/users.routes";
import { logger } from "./logger";
import guard from 'fastify-guard'

const fastify= require("fastify")


//build server in a different file for ease of testing
export async function serverBuild(){ 
    const app=fastify({
        logger:logger,
    });

    //register plugins
    app.register(guard, {
        requestProperty: "user",
        scopeProperty:"scopes",
        errorHandler:(result, request, reply)=>{
            return reply.send("nope i wont allow it")
        }
    })

    //connecting to the registered routes
    app.register(applicationRoutes,{prefix: '/api/applications'})
    app.register(userRoutes,{prefix:"api/users"})
    app.register(roleRoutes,{prefix:"api/roles"})

    return app;
}