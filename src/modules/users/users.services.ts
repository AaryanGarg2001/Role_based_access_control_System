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