// import http from "node:http";
// import fs from "node:fs";

const fs = require("node:fs");
const http = require("http");

const host = 'localhost';
const port = 8000;


const topicsJson = fs.readFileSync('./test/topics.json', 'utf8')

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");

    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3000', /* @dev First, read about security */
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Max-Age': 2592000, // 30 days
      /** add other headers as per requirement */
    };
  
    // if (req.method === 'OPTIONS') {
    //   res.writeHead(204, headers);
    //   res.end();
    //   return;
    // }

    res.writeHead(200, headers);
    res.end(topicsJson);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});



