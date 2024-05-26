import { FastifyInstance } from "fastify";
import { assignRoleToUserHandler, createUserHandler, loginHandler } from "./users.controllers";
import { LoginBodyJsonSchema, assignRoleToUserJsonSchema, createUserJsonSchema } from "./users.schemas";
import { assignRoleToUser } from "./users.services";

export async function userRoutes(app:FastifyInstance) {
    app.post('/',{
        schema:createUserJsonSchema,
    },createUserHandler)

    app.post('/login',{
        schema:LoginBodyJsonSchema
    },loginHandler)
    app.post('/roles',{schema:assignRoleToUserJsonSchema},
    assignRoleToUserHandler)
}