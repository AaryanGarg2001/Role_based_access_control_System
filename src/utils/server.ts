import { applicationRoutes } from "../modules/application/application.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import { userRoutes } from "../modules/users/users.routes";
import { logger } from "./logger";
import guard from 'fastify-guard'
import jwt from 'jsonwebtoken'
import fastify from "fastify";

type User = {
    id:string,
    applicationId:string,
    scopes: Array<string>
}

declare module 'fastify'{
    interface FastifyRequest{
        user : User
    }
}

//build server in a different file for ease of testing
export async function serverBuild(){ 
    const app=fastify({
        logger:logger,
    });

    app.decorateRequest('user',null)

    app.addHook('onRequest',async (req:any,res:any)=>{
        const authHeader = req.headers.authorization;

        if(!authHeader)
            return;

        try{
            const token = authHeader.replace('Bearer ','')
            const decoded = jwt.verify(token, 'Signzy-rules') as User

            req.user = decoded;
            

        }
        catch(e){

        }
    })

    //register plugins
    app.register(guard, {
        requestProperty: "user",
        scopeProperty:"scopes",

        errorHandler:(result:any, request:any, reply:any)=>{
            return reply.send("nope i wont allow it")
        }
    })

    //connecting to the registered routes
    app.register(applicationRoutes,{prefix: '/api/applications'})
    app.register(userRoutes,{prefix:"api/users"})
    app.register(roleRoutes,{prefix:"api/roles"})

    return app;
}