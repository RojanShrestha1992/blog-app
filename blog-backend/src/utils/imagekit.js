const ImageKit = require("imagekit");

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

const missingVars = [
    ["IMAGEKIT_PUBLIC_KEY", IMAGEKIT_PUBLIC_KEY],
    ["IMAGEKIT_PRIVATE_KEY", IMAGEKIT_PRIVATE_KEY],
    ["IMAGEKIT_URL_ENDPOINT", IMAGEKIT_URL_ENDPOINT],
].filter(([, value]) => !value).map(([name]) => name);

if (missingVars.length > 0) {
    throw new Error(`Missing ImageKit environment variables: ${missingVars.join(", ")}`);
}

const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
})

module.exports = imagekit;