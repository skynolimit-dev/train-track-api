import express from 'express';
import cors from 'cors';
import { getTrainTimes, getServiceInfo } from './lib/realtime-trains-api.js'; 
import { getXbarOutput } from './lib/xbar.js';

// Use Express to create a server
const app = express();
app.use(cors());

app.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/v1/departures/from/:fromStation', async (req, res) => {
    res.json(await getTrainTimes(req.params.fromStation));
});

app.get('/api/v1/departures/from/:fromStation/to/:toStation', async (req, res) => {
    res.json(await getTrainTimes(req.params.fromStation, req.params.toStation));
});

app.get('/api/v1/service/:serviceId/runDate/:runDate', async (req, res) => {
    res.json(await getServiceInfo(req.params.serviceId, req.params.runDate));
});

app.get('/api/v1/xbar/from/:fromStation/to/:toStation/max_departures/:maxDepartures/return_after/:returnAfter?', async (req, res) => {
    res.send(await getXbarOutput(req.params.fromStation, req.params.toStation, req.params.maxDepartures, req.params.returnAfter));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});