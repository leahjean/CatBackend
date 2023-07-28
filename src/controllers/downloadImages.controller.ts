import axios, { AxiosResponse } from "axios";
import {Request, Response} from 'express';
import scrapeImageNames from "../utils/imageScrapeUtils";

// const imageUrls: string[] = [
//     'https://kittenrescue.org/wp-content/uploads/2023/06/KitenRescue_Ann-Margret1-500x500.jpg',
//     'https://kittenrescue.org/wp-content/uploads/2023/06/KittenRescue-Greybies2-500x500.jpg',
//     'https://kittenrescue.org/wp-content/uploads/2023/06/KittenRecue-AJ1-500x500.jpg',
//     'https://kittenrescue.org/wp-content/uploads/2023/06/KittenREscue_Whiskey3-500x500.jpg'
// ];

const KR_PATH_PREFIX = 'https://kittenrescue.org/wp-content/uploads';
const BASE_64 = 'base64';

const downloadAndEncodeImages = async ([date, imagePaths]: [string, string[]]): Promise<string[]> => {
    const images = [];
    console.log('Downloading and encoding images');
    const pathPrefix = `${KR_PATH_PREFIX}/${date.substring(0, 4)}/${date.substring(5, 7)}`; 
    let count = 0;
    for (const imagePath of imagePaths) {
        const fullImagePath = `${pathPrefix}/${imagePath}`;
        const response: AxiosResponse<Buffer> = await axios.get(fullImagePath, { responseType: 'arraybuffer' });
        images.push(response.data.toString(BASE_64));
        console.log('Downloaded new image', new Date(Date.now()));
        count++;
        if (count > 10) {
            break;
        }
    }
    return images;
};

export const downloadImages = async (_req: Request, res: Response) => {
    try {
        console.log("Received download images request", new Date(Date.now()));
        const imageUrls = await scrapeImageNames();
        console.log("Starting image fetch", new Date(Date.now()));
        const imagePromises = Object.entries(imageUrls).map(downloadAndEncodeImages);
        const images: string[] = [];
        for (const imagePromiseArr of imagePromises) {
            const currImages = await imagePromiseArr;
            images.push(...currImages);
        }
        res.json(images);
    } catch (error) {
        console.error('Error downloading and sending image:', error);
        res.status(500).send('Error downloading and sending image.');
    }
}