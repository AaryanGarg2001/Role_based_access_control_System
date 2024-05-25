import { FastifyInstance } from "fastify";
import { createUserHandler } from "./users.controllers";
import { createUserJsonSchema } from "./users.schemas";

export async function userRoutes(app:FastifyInstance) {
    app.post('/',{
        schema:createUserJsonSchema,
    },createUserHandler)
}