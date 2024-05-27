import { FastifyInstance } from "fastify";
import { assignRoleToUserHandler, createUserHandler, loginHandler } from "./users.controllers";
import { LoginBodyJsonSchema, assignRoleToUserBody, assignRoleToUserJsonSchema, createUserJsonSchema } from "./users.schemas";
import { assignRoleToUser } from "./users.services";
import { PERMISSIONS } from "../../config/permissions";

export async function userRoutes(app:FastifyInstance) {
    app.post('/',{
        schema:createUserJsonSchema,
    },createUserHandler)

    app.post('/login',{
        schema:LoginBodyJsonSchema
    },loginHandler)

    app.post<{
        Body:assignRoleToUserBody;
    }>('/roles',{
        schema:assignRoleToUserJsonSchema,
        preHandler:[app.guard.scope(PERMISSIONS['users:roles:write'])]
    },
    assignRoleToUserHandler)
}