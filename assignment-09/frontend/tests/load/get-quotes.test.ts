// @ts-ignore
import http from "k6/http";
// @ts-ignore
import { check, sleep } from "k6";

export let options = {
    stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 50 },  
        { duration: "10s", target: 0 }, 
    ],
};

export default function () {
    let res = http.get("http://localhost:3000/api/quotes");

    check(res, {
        "status is 200": (r) => r.status === 200, // Ensure the response status is 200 OK
        "response time is < 500ms": (r) => r.timings.duration < 500, // Ensure the request completes in under 500ms
    });

    sleep(1);
  }