import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
    if (!file) {
        console.log("Cloudinary: No file provided")
        return null
    }

    // Validate Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("Cloudinary: Missing environment variables")
        console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING")
        console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING")
        console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING")
        return null
    }

    try {
        console.log("Cloudinary: Starting upload, file size:", file.size)
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "agrowcart" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error)
                        reject(error)
                    } else {
                        console.log("Cloudinary: Upload successful, URL:", result?.secure_url)
                        resolve(result?.secure_url ?? null)
                    }
                }
            )
            uploadStream.end(buffer)
        })
    } catch (error) {
        console.error("Cloudinary exception:", error)
        return null
    }

}


export default uploadOnCloudinary