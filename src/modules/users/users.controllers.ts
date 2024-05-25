import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody } from "./users.schemas";
import { SYSTEMROLES } from "../../config/permissions";
import { assignRoleToUser, createUser, getRoleByName, getUsersByApplication } from "./users.services";

export async function createUserHandler(
    req:FastifyRequest<{
        Body:CreateUserBody;
    }>,rep: FastifyReply
){
    const {initialUser, ...data}= req.body

    const rolename = initialUser? SYSTEMROLES.SUPER_ADMIN:SYSTEMROLES.APPLICATION_USER;

    if(rolename === SYSTEMROLES.SUPER_ADMIN){
        const appUsers=await getUsersByApplication(data.applicationId);

        if(appUsers.length>0){
            return rep.code(400).send({
                message:"App already has super-user"
            });
        }
    }
    const role=await getRoleByName({
        name:rolename,
        applicationId:data.applicationId
    })
    try{
        const user = await createUser(data);

        //giving a role to the user
        await assignRoleToUser({
            userId:user.id,
            roleId:role.id,
            applicationId:data.applicationId
        })

        return user;
    }
    catch(e){
        rep.send(e)
    }
}