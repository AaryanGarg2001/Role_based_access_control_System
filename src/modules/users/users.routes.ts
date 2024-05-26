import { FastifyInstance } from "fastify";
import { createUserHandler, loginHandler } from "./users.controllers";
import { LoginBodyJsonSchema, createUserJsonSchema } from "./users.schemas";

export async function userRoutes(app:FastifyInstance) {
    app.post('/',{
        schema:createUserJsonSchema,
    },createUserHandler)

    app.post('/login',{
        schema:LoginBodyJsonSchema
    },loginHandler)
}