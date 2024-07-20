import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullName, age, country, password } = req.body;
    const cnicLocalURL = req.files?.cnicImg[0].path;
    const profileImg = req.files?.profileImg[0].path;

    if (!cnicLocalURL || !profileImg || !username || !email || !fullName || !age || !country || !password) {
        throw new ApiError(400, "all fieds are required")
    }

    const cnic = await uploadOnCloudinary(cnicLocalURL)
    const profile = await uploadOnCloudinary(profileImg)
    if (!cnic) {
        throw new ApiError("CNIC Upload operation Failed")
    }
    if (!profile) {
        throw new ApiError("Profile Upload operation Failed")
    }
    const exitinguser = await User.find(
        {
            username: username
        }
    )
    const exitingEmail = await User.find(
        {
            email: email
        }
    )
    console.log("exitingEmail", exitingEmail)
    if (exitingEmail.length > 0) {
        throw new ApiError(400, " email already exits")
    }
    if (exitinguser.length > 0) {
        throw new ApiError(400, "username already exits")
    }
    console.log("User", exitinguser)

    const user = await User.create(
        {
            username: username,
            email: email,
            fullName: fullName,
            age: age,
            country: country,
            password: password,
            profileImage: profile.url,
            cnicImg: cnic.url
        }
    )

    const createduser = await User.find(user._id).select("-password -refreshToken")
    if (!createduser) {
        throw new ApiError(400, "user detail is not valid ")
    }
    if (!user) {
        throw new ApiError(400, "user detail is not valid ")
    }

    return res.status(200).json(new ApiResponse(200, createduser, "user registered successfully"))
})

const loginUser = asyncHandler((async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email and password are required")
    }
    const user = await User.findOne(
        {
            $or: [{ email: email }]
        }
    )
    if (!user) {
        throw new ApiError(404, "no email found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
    // console.log("refreshToken", refreshToken)
    // console.log("accessToken", accessToken)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "wrrong password")
    }
    const loggedinUsser = await User.findById(user._id)
        .select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }



    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshoken", refreshToken, options)
        .json(new ApiResponse(200, { loggedinUsser, accessToken, refreshToken }, "User login successfully"))
}))

const getalluser = asyncHandler(async (req, res) => {

    const user = await User.find()

    return res.status(200)
        .json(new ApiResponse(200, user, "users fetched successfully"))
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access t token")
    }

}
export { registerUser, loginUser, getalluser }