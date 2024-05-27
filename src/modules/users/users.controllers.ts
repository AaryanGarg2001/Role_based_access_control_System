import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, LoginBody, assignRoleToUserBody,} from "./users.schemas";
import { SYSTEMROLES } from "../../config/permissions";
import { assignRoleToUser, createUser, getRoleByName, getUserByEmail, getUsersByApplication } from "./users.services";
import jwt from "jsonwebtoken"
import { logger } from "../../utils/logger";

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
        console.log(e);
        rep.send(
            {message:"Unable to out up with your request"}
        )
    }
}

export async function loginHandler(req:FastifyRequest<{
    Body: LoginBody
}>, res:FastifyReply) {
    
    const {applicationId, email, password}= req.body;


    const user = await getUserByEmail({email, applicationId});

    if(!user){
        return res.code(400).send({
            message:"Invalid email id"
        })
    }

    const token = jwt.sign({
        id:user.id,
        email,
        applicationId,
        scopes:user.permissions
    },"Signzy-rules")

    return {token};
}


//here we havent checked if the role and the user are on the same applicationId
export async function assignRoleToUserHandler(req:FastifyRequest<{
    Body:assignRoleToUserBody
}>,res:FastifyReply) {

    const user=req.user;
    const applicationId=user.applicationId
    
    const {userId, roleId} = req.body;

    try{
        const result = await assignRoleToUser({
            userId, 
            applicationId,
            roleId
        })
        return result;
    }

    catch(e){
        logger.error(e,'error assigning role to user')
        return res.code(400);
    }
}