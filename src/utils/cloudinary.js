import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs'

cloudinary.config({ 
    // cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    
    // api_key:process.envCLOUDINARY_API_KEY, 
    // api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath)=>{
try{
    if (!localFilePath) return null
    //upload files on cloudinary
    const response = await cloudinary.uploader.upload(
    localFilePath, {
       resource_type:'auto',
    }
)
//file has been uploaded success
console.log('file has been uploaded on cloudinary',response.url)
fs.unlinkSync(localFilePath)
// console.log('cloudinary Response-------',response)
return response
}
catch(error) {
    fs.unlinkSync(localFilePath)//remove the locally temp saved files as the operation failed
    return null
};
}

export {uploadOnCloudinary}