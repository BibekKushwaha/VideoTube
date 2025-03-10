import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiErrors(400, "All the fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiErrors(409, "User already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar path cannot find");
    }
    const avatarimg = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatarimg) {
        throw new ApiErrors(400, "Avatar upload failed");
    }

    const user = await User.create({
        email,
        fullName,
        password,
        avatar: avatarimg.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    });

    // console.log("created user details before find method", user);

    // Await the user retrieval
    const createdUser = await User.findOne({ _id: user._id }).select("-password -refreshToken").lean();
    // console.log("created user details after find method", createdUser);
    
    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

export { registerUser };
