import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"




dotenv.config({
    path: "./.env"
})


connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR IN SERVER", error)
        })
        app.listen(process.env.PORT || 8001, () => {
            console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`)

        })

    })
    .catch((error) => {
        console.log("MONGODB CONNECTION FAILED!! ", error)
    })