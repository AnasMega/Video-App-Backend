import mongoose from "mongoose"
import { DB_NAME } from "../utils/constants.js"


const connectDB = async () => {


    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
        console.log(`MONGO-DB DATABASE CONNECTED!! || HOST ON ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log(`"MONGODB CONNTECTION ERROR :"${error}`)
    }


}


export default connectDB