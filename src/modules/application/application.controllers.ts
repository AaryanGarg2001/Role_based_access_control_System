import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./application.schemas";
import { createApplication, getApplications } from "./application.services";
import { createRole } from "../roles/roles.services";
import { ALLPERMISSIONS, SYSTEMROLES, USER_ROLE } from "../../config/permissions";

export async function createApplicationHandler(
    req: FastifyRequest<{
        Body:CreateApplicationBody
    }>,
    rep: FastifyReply
) {
    const{name}= req.body;

    const application = await createApplication({
        name,
    });

    const superAdminRole = await createRole(
        {
            applicationId: application.id,
            name: SYSTEMROLES.SUPER_ADMIN,
            permissions: ALLPERMISSIONS as unknown as Array<string>,
        }

    );

    const applicationUserRole = await createRole({
        applicationId:application.id,
        name: SYSTEMROLES.APPLICATION_USER,
        permissions:USER_ROLE
    });


    return {
        application,
        applicationUserRole,
        superAdminRole
    };
}

export async function getApplicationshandler() {
    return  getApplications();
}