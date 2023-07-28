import { resolve } from 'path';
import { readFileSync, readdirSync } from 'fs';

const UTF8 = 'utf8';
const IMAGE_NAME_REGEX = /"k|K[\w\-]+\b500x500\.\w{3}"/g;
const CAT_IMAGE_HTML_DIR_NAME = 'catImageHtmls';

const readHtmls = async (): Promise<Record<string, string>> => {
    try {
        console.log(`Reading htmls`, new Date(Date.now()));
        const catImageHtmlDir = resolve(CAT_IMAGE_HTML_DIR_NAME);
        const fileNames = readdirSync(catImageHtmlDir, UTF8);
        const htmls: Record<string, string> = {};
        for (const fileName of fileNames) {
            const fileNamePath = resolve(catImageHtmlDir, fileName);
            const fileHtml = readFileSync(fileNamePath, UTF8);
            console.log(`Read file ${fileName} with length ${fileHtml.length}`);
            htmls[fileName] = fileHtml;
        }
        return htmls;
    } catch (error) {
        console.error('Failed to read htmls', error);
        throw error;
    }
}

const parseImageNamesFromHtml = (htmls: Record<string, string>): Record<string, string[]> => {
    const imageNames: Record<string, string[]> = {};
    let imageName;
    console.log('Starting parsing image names', new Date(Date.now()));
    for (const fileName in htmls) {
        const currImageNames = [];
        while ((imageName = IMAGE_NAME_REGEX.exec(htmls[fileName])) !== null) {
            currImageNames.push(imageName[0]);
        }
        console.log(`Filename ${fileName} has ${currImageNames.length} matches.`)
        imageNames[fileName] = currImageNames;
    }
    return imageNames;
}

const scrapeImageNames = async (): Promise<Record<string, string[]>> => {
    const htmls = await readHtmls();
    return parseImageNamesFromHtml(htmls);
}

export default scrapeImageNames;