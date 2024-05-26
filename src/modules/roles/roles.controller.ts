import { FastifyReply, FastifyRequest } from "fastify";
import { createRoleBody } from "./roles.schemas";
import { createRole } from "./roles.services";

export async function createRoleHandler(req:FastifyRequest<{
    Body: createRoleBody
}>, res:FastifyReply) {
    const {name, permissions, applicationId} = req.body;

    const role=await createRole({
        name,permissions,applicationId
    })

    return role;
}