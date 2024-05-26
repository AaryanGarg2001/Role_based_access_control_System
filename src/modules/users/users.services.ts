import { InferInsertModel, and, eq } from "drizzle-orm";
import { applications, roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from 'argon2'

export async function createUser(data:InferInsertModel<typeof users>) {

    const  hashedPassword = await argon2.hash(data.password)

    const result = await db.insert(users).values({ ...data, password:hashedPassword})
    .returning(
        {id:users.id,
        email:users.email,
        name: users.name,
        applicationId:applications.id}
    )    
    return result[0];

}


//not actually getting used in code, but it helped learn about postgresql
export async function getRoleByName({
    name, applicationId
}:{
    name: string;
    applicationId: string
}) {
    const result = await db.select().from(roles).where(
        //normal SQL command
        //SELECT * FROM roles
        //WHERE name=passedName AND appId=PassedId

        and(
            eq(roles.name,name),
            eq(roles.applicationId,applicationId)
        )

    ).limit(1);

    return result[0];
    
}

export async function getUsersByApplication(applicationId:string) {
    const result= await db.select().from(users).where(
        eq(users.applicationId,applicationId)
    )

    return result;
}

export async function assignRoleToUser(data:InferInsertModel<typeof usersToRoles>) {
    const result = await db.insert(usersToRoles).values(data).returning();

    return result[0];
}

export async function getUserByEmail({email, applicationId}:{
    email:string,
    applicationId:string
}){
    //we get the user with the given emailid and application id, and also all the roles assigned to it
    const result = await db.select({
        id:users.id,
        email:users.email,
        name:users.name,
        applicationId:users.applicationId,
        roleId:roles.id,
        password:users.password,
        permissions:roles.permissions
    }).from(users).where(
        and(
            eq(users.email,email),
            eq(users.applicationId,applicationId)
        )
    )
    .leftJoin(usersToRoles,
        eq(usersToRoles.userId,users.id)
    )
    .leftJoin(roles,
        eq(roles.id,usersToRoles.roleId)
    )

    if(!result.length)
        return null;

    const user = result.reduce((acc, curr) => {
        if (!acc.id) {
          return {
            ...curr,
            permissions: new Set(curr.permissions),
          };
        }
    
        if (!curr.permissions) {
          return acc;
        }
    
        for (const permission of curr.permissions) {
          acc.permissions.add(permission);
        }
    
        return acc;
      }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

    return {
        ...user,
        permissions: Array.from(user.permissions),
    }
}