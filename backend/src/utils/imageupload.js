import cloudinary from "./cloudinary.js";
import { Readable } from "stream";

export const imageUpload = async (buffer, filename) => {
    return new Promise((resolve, reject) => {        
        const stream = cloudinary.uploader.upload_stream(
            { folder: "chat", public_id: filename },
            (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }                
                resolve(result);
            }
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};
