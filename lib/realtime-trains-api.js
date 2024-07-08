import axios from 'axios';
axios.defaults.timeout = 500;

import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 3 });

// Returns train times from a specific station and optionally to another specific station
export async function getTrainTimes(fromStationCode, toStationCode = undefined) {
    let trainTimes = [];

    try {
        if (toStationCode) {
            trainTimes = await getTrainTimesFromTo(fromStationCode, toStationCode);
        } else {
            trainTimes = await getTrainTimesFrom(fromStationCode);
        }

        return {
            departures: trainTimes.services
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return {
            error: error
        };
    }
}

// Returns train times from a specific station to another specific station
async function getTrainTimesFromTo(fromStationCode, toStationCode) {
    const apiPath = `search/${fromStationCode}/to/${toStationCode}`;
    return await getApiResponseData(apiPath);
}

// Returns train times from a specific station
async function getTrainTimesFrom(fromStationCode) {
    const apiPath = `search/${fromStationCode}`;
    return await getApiResponseData(apiPath);
}

// Returns information about a specific train service
export async function getServiceInfo(serviceId, runDate) {
    const YYYY = runDate.substring(0, 4);
    const MM = runDate.substring(5, 7);
    const DD = runDate.substring(8, 10);
    const apiPath = `service/${serviceId}/${YYYY}/${MM}/${DD}`;
    return await getApiResponseData(apiPath);
}

// Fetches data from the Realtime Trains API
async function getApiResponseData(apiPath) {
    const url = `https://api.rtt.io/api/v1/json/${apiPath}`;
    console.log(`Fetching data from ${url}`);
    try {
        const response = await axios.get(url, {
            auth: {
                username: process.env.RTT_API_USERNAME,
                password: process.env.RTT_API_PASSWORD
            }
        });
        return response.data;
    } catch (error) {
        error = error.response ? error.response : error;
        console.error(`Failed to get data from Realtime Trains API: ${error}`);
        return { error: 'Failed to get data from Realtime Trains API', error };
    }
}