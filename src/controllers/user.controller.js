import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const  registerUser = asyncHandler(async (req,res)=>{
    // get user details from fronted
    // validation (check user dat not empty)
    // check user already exist or not(username,email)
    //check for images and avatar
    // upload image in cloudinary
    //check avatar upload successfully or not
    // create user object
    //create entries from dp
    // remove password and refresh token from response
    //check user creation
    // return response

    // get user details from fronted
    const {username,email,fullName,password} = req.body;

    // validation (check user dat not empty)
    if(
        [username,email,fullName,password].some((field)=> field?.trim() === " ")
    ){
        throw new ApiErrors(400,"All the fields are required");
    } 

    // check user already exist or not(username,email) 
    const existingUser = await User.findOne(
        { $or: [{ username }, { email }] },
    );
    if (existingUser) {
        throw new ApiErrors(409, "User already exist");
    }

    //check for images and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiErrors(400,"Avatar is required");
    }
    const avatar = uploadOnCloudinary(avatarLocalPath);
    const coverImage = uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiErrors(400,"Avatar upload failed");
    }

    const user  =  await User.create({
        email,
        fullName,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase()

    })
    // remove password and refresh token from response
    const createdUser = User.findOne(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiErrors(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export { registerUser};