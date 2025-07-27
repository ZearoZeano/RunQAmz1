// server.js (เดิมชื่อ index.js) ไม่ใช้ฐานข้อมูล SQLite อีกต่อไป
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// ใช้ตัวแปรในหน่วยความจำแทนฐานข้อมูล
let currentQueue = 0;
let row = 0;

// แทนฟังก์ชัน upQ (เดิมเพิ่มข้อมูลลงฐานข้อมูล)
function upQ(newQ) {
    console.log("เพิ่มคิวที่" + newQ + "สำเร็จ");
}

// แทนฟังก์ชัน deQ (เดิมลบข้อมูลจากฐานข้อมูล)
function deQ(newQ) {
    console.log("รันคิวใหม่สำเร็จ คิวปัจจุบันคือ:" + newQ);
}

const message = {
    type: "queue",
    queue: currentQueue,
};

app.use(express.static(path.join(__dirname, "public")));

app.get("/sse", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (req.query.action === "enqueue") {
        if (currentQueue >= req.query.crentQ) {
            deQ();
        }
        row = req.query.rowQ;
        currentQueue = parseInt(req.query.crentQ);
        message.type = "queue";
        message.queue = currentQueue;
        upQ(currentQueue);
    }

    if (req.query.action === "newnum") {
        currentQueue = 0;
        message.type = "renum";
        message.queue = currentQueue;
        deQ(currentQueue);
    }

    res.write(`data: ${JSON.stringify(message)}\n\n`);
});

app.get("/get-current-queue", (req, res) => {
    res.setHeader("Connection", "keep-alive");
    res.json({ queue: currentQueue, rowQ: row });
});

app.get("/get-current-row", (req, res) => {
    res.setHeader("Connection", "keep-alive");
    res.json({ rowQ: row });
});

app.get("/chk", (req, res) => {
    res.setHeader("Connection", "keep-alive");
    console.log("คิวปัจจุบัน:", currentQueue);
    res.send("คิวปัจจุบัน: " + currentQueue);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
