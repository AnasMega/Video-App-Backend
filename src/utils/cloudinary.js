import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

//configurations
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {

    try {

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //files updlaoded successfuly
        console.log("file uploaded on cloudinary successfully", response.url)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally save file as upload operation failed
        return null
    }

}
const deleteCloudinary = async (localFilePath) => {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.destroy(localFilePath)
    return response
}




export { uploadOnCloudinary, deleteCloudinary }