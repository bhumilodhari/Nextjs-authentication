// fT2JwGcMcFP3lGLz
//mongodb+srv://auth:<password>@atlascluster.dk0skvj.mongodb.net/?retryWrites=true&w=majority

import { MongoClient } from "mongodb";
export async function connectToDatabase() {
    const client = await MongoClient.connect(
        'mongodb+srv://auth:jCLYzyAzDhHugde6@atlascluster.dk0skvj.mongodb.net/auth-demo?retryWrites=true&w=majority'
    );
    return client;
}