const fetch = require("node-fetch");

const { VITE_API_URL, VITE_API_BASEPATH, VITE_API_KEY } = process.env;
const url = "http://" + VITE_API_URL + VITE_API_BASEPATH +"?apiKey=" + VITE_API_KEY;

exports.handler = async function (event, context) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();
        return { statusCode: 200, body: JSON.stringify({ data: responseData }) };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed fetching data' }),
        };
    }
};
