import { env } from "./config/env";
import { db } from "./db";
import { logger } from "./utils/logger";
import { serverBuild } from "./utils/server"
import {migrate} from 'drizzle-orm/node-postgres/migrator'

async function escapeProgram({
    app,
}:{
    app: Awaited <ReturnType<typeof serverBuild>>;
}){
    await app.close();
}

async function main(){
    const app=await serverBuild()

    await app.listen({
        port: env.PORT,
        host: env.HOST,

    })

    await migrate(db, {
        migrationsFolder: "./migrations"
    })

    const signals = ['SIGINT', 'SIGTERM'] 


    
    //TRIGGERRING WHEN A SIGNAL IS CAUGHT
    for(const signal of signals){
        process.on(signal,()=>{
            console.log("Signal to shut down received");
            escapeProgram({app} );
        })
    }

}
main();