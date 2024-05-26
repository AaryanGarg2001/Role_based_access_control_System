import { z } from "zod";
import { ALLPERMISSIONS } from "../../config/permissions";
import zodToJsonSchema from "zod-to-json-schema";

const createRoleBodySchema =z.object({
    name:z.string(),
    permissions:z.array(z.enum(ALLPERMISSIONS)),
    applicationId:z.string().uuid()
})

export type createRoleBody = z.infer<typeof createRoleBodySchema>

export const createRoleJsonSchema = {
    body: zodToJsonSchema(createRoleBodySchema,'createRoleBodySchema')

};