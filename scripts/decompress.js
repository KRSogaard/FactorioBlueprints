const zlib = require('zlib');
const base64js = require('base64-js');
const fs = require('fs');
const util = require('util');

// Convert fs.readFile and fs.writeFile into Promise versions to be used in async/await
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function decodeAndUncompressFile(inputFilePath, outputFilePath) {
    try {
        // Read the file
        const data = await readFile(inputFilePath, 'utf8');
        const json = decodeBlueprint(data);
        
        await writeFile(outputFilePath, json)
                    .then(() => console.log(`File has been successfully uncompressed and saved as ${outputFilePath}`))
                    .catch(error => console.error(`Error writing file to disk: ${error}`));
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
    }
}
function decodeBlueprint(blueprintString) {
    // Skip the first byte (the version byte)
    const base64String = blueprintString.slice(1);

    // Base64 decode the string
    const decodedBytes = base64js.toByteArray(base64String);

    // Decompress using zlib inflate
    const decompressedBuffer = zlib.inflateSync(Buffer.from(decodedBytes));

    return decompressedBuffer;
}
// Use the function, assuming the input file path is 'compressed.txt' and the output file path is 'uncompressed.json'
decodeAndUncompressFile('../test.md', '../uncompressed.json');
