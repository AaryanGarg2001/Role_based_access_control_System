export const ALLPERMISSIONS =[
    //permissions for the user to do stuff
    "users:roles:write",
    "users:roles:delete",


    //posts permissions
    'posts:write',
    'posts:read',
    'post:delete',
    'post-edit-own'
] as const;

export const PERMISSIONS = ALLPERMISSIONS.reduce((acc, permission)=>{

    acc[permission]=permission;

    return acc;
},{} as Record<(typeof ALLPERMISSIONS)[number],(typeof ALLPERMISSIONS)[number]>);

export const USER_ROLE = [
    PERMISSIONS["posts:write"],
    PERMISSIONS["posts:read"],

]

export const SYSTEMROLES ={
    SUPER_ADMIN:"SUPER_ADMIN",
    APPLICATION_USER: "APPLICATION_USER"
}
