const enqueueButton = document.getElementById("enqueue-button");
const newbutton = document.getElementById("newnum");
const currentQueueElement = document.getElementById("current-queue");
const queueAudio = document.getElementById("queue-audio");
const loadingPopup = document.getElementById("loading-popup");
const queueListElement = document.getElementById("queue-list"); // ตัวแปรที่เพิ่มขึ้นมา

let currentQueue = 0;
let isPlaying = false;
let timer = 0;
let queueList = [];
let isAutoEnqueueEnabled = false;
let checkInterval;
let rowQueue = 0;

const requeueButton = document.getElementById("requeue-button");
const requeuePopup = document.getElementById("requeue-popup");
const confirmRequeueButton = document.getElementById("confirm-requeue-button");
const cancelRequeueButton = document.getElementById("cancel-requeue-button");
const requeueInput = document.getElementById("requeue-input");
const setqueueButton = document.getElementById("setnum");
const setqueuePopup = document.getElementById("setqueue-popup");
const confirmsetButton = document.getElementById("confirm-set-button");
const cancelsetButton = document.getElementById("cancel-set-button");
const setqueueInput = document.getElementById("set-input");
const fullscreenButton = document.getElementById("fullscreen-button");

fullscreenButton.addEventListener("click", () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }

    // หลังจากกดปุ่ม 1 ครั้ง ก็ซ่อนปุ่ม
    fullscreenButton.classList.add("hidden");
});

// เพิ่มตัวตรวจสอบการออกจากโหมดเต็มจอ
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        // แสดงปุ่มเมื่อออกจากโหมดเต็มจอ
        fullscreenButton.classList.remove("hidden");
    }
});

function testaudio() {
    if (isPlaying) {
        return;
    }
    const audioElement3 = document.getElementById(`testsound`);
    audioElement3.play();
}

let intervalId22 = setInterval(testaudio, 600000);

function chkcon() {
    fetch("/chk")
        .then((response) => response.json())
        .then((data) => {
            //console.log('การเชื่อมต่อสมบูรณ์');
            //document.getElementById('text1').textContent = "คิวปัจจุบัน: ";
        })
        .catch((error) => {
            //document.getElementById('text1').textContent = "อินเทอร์เน็ตขัดข้อง จอแสดงผลอาจจะไม่แสดงคิวล่าสุด'";
            /*enqueueButton.disabled = true;
            newbutton.disabled = true;
            setqueueButton.disabled = true;*/
        });
}

setInterval(chkcon, 120000);
timer = 600000;

requeueButton.addEventListener("click", () => {
    requeueButton.disabled = true;
    requeuePopup.style.display = "block";
    requeueInput.value = "";
});

confirmRequeueButton.addEventListener("click", () => {
    const requeuedQueue = parseInt(requeueInput.value);
    if (!isNaN(requeuedQueue) && requeuedQueue < 100) {
        playQueueSound(requeuedQueue);
        enqueueButton.disabled = false;
        requeuePopup.style.display = "none";
        requeueInput.value = "";
        isPlaying = false;
    } else if (isNaN(requeuedQueue)) {
        playQueueSound(currentQueue);
        enqueueButton.disabled = false;
        requeuePopup.style.display = "none";
        requeueInput.value = "";
        isPlaying = false;
    } else {
        alert("กรุณาป้อนเลขคิวที่ถูกต้อง");
    }
});

cancelRequeueButton.addEventListener("click", () => {
    requeueButton.disabled = false;
    requeuePopup.style.display = "none";
    requeueInput.value = "";
});

setqueueButton.addEventListener("click", () => {
    setqueueButton.disabled = true;
    setqueuePopup.style.display = "block";
    setqueueInput.value = "";
});

confirmsetButton.addEventListener("click", () => {
    const setQueue = parseInt(setqueueInput.value);
    if (!isNaN(setQueue) && setQueue < 100) {
        currentQueue = setQueue;
        sendSSEMessage("enqueue", currentQueue);
        currentQueueElement.textContent = setQueue;
        enqueueButton.disabled = false;
        setqueuePopup.style.display = "none";
        setqueueInput.value = "";
    } else {
        alert("กรุณาป้อนเลขคิวที่ถูกต้อง");
    }
});

cancelsetButton.addEventListener("click", () => {
    setqueueButton.disabled = false;
    setqueuePopup.style.display = "none";
    setqueueInput.value = "";
});

function updateQueueDisplay() {
    fetch("/get-current-queue")
        .then((response) => response.json())
        .then((data) => {
            if (currentQueue != data.queue && data.queue > 0) {
                sendSSEMessage("enqueue", currentQueue);
            } else {
                document.getElementById("current-queue").textContent =
                    data.queue;
                currentQueue = data.queue;
            }
        })
        .catch((error) => {
            //document.getElementById('text1').textContent = "อินเทอร์เน็ตขัดข้อง จอแสดงผลอาจจะไม่แสดงคิวล่าสุด'";
        });
}

updateQueueDisplay();
setInterval(updateQueueDisplay, 2000);
function sendSSEMessage(action, Qnow, rq) {
    const sseEndpoint =
        "/sse?action=" + action + "&crentQ=" + Qnow + "&rowQ=" + rq;
    const eventSource = new EventSource(sseEndpoint);

    eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "queue") {
            clearInterval(intervalId22);
            intervalId22 = setInterval(testaudio, 600000);

            eventSource.close();
        }

        // ตรวจสอบส่วนอื่น ๆ ของโค้ด...

        if (message.type === "renum") {
            currentQueue = 0;
            currentQueueElement.textContent = message.queue;
            eventSource.close();
        }
        if (message.type === "set") {
            clearInterval(intervalId22);
            intervalId22 = setInterval(testaudio, 600000);

            eventSource.close();
        }
    };

    eventSource.onerror = (error) => {
        //console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ SSE:', error);
    };
}

enqueueButton.addEventListener("click", () => {
    if (currentQueue < 99) {
        //currentQueueElement.textContent = 'กำลังโหลด...';
        currentQueue++;
        sendSSEMessage("enqueue", currentQueue); // ส่งคำร้องขอ SSE ที่ระบุการเพิ่มคิว
        addToQueue(currentQueue);
    } else {
        rowQueue++;
        currentQueue = 1;
        sendSSEMessage("enqueue", currentQueue, rowQueue); // ส่งคำร้องขอ SSE ที่ระบุการเพิ่มคิว
        addToQueue(currentQueue);
    }
});

newbutton.addEventListener("click", () => {
    sendSSEMessage("newnum");
    currentQueue = 0;
    currentQueueElement.textContent = 0;
});

// ส่วนที่เพิ่มคิว
function addToQueue(queueNumber) {
    queueList.push(queueNumber);
    currentQueueElement.textContent = queueNumber;
    // alert(queueNumber);
    //alert(queueList);
    if (queueList.length === 1) {
        // ถ้าไม่มีการเล่นเสียงในปัจจุบัน ให้เริ่มเล่นคิวทันที
        playQueueList();
    }
}

function startCheckingQueue() {
    checkInterval = setInterval(() => {
        if (!isPlaying && queueList.length > 0) {
            const queueNumber = queueList.shift();
            //setTimeout(() => {

            playQueueSound(queueNumber);
            isPlaying = false;
            //}, 2000);
        }
    }, 2000); // 1 วินาที
}

function stopCheckingQueue() {
    clearInterval(checkInterval);
}

function playQueueList() {
    // หยุดการตรวจสอบเพื่อเล่นคิว
    stopCheckingQueue();
    // เริ่มต้นการตรวจสอบเพื่อเล่นคิวอีกครั้ง
    startCheckingQueue();
}

// เรียกใช้ฟังก์ชันเพื่อเริ่มต้นการตรวจสอบ
startCheckingQueue();

function playQueueSound(queueNumber) {
    //const queueNumber = queueList.shift(); // เอาคิวที่อยู่ในตำแหน่งแรกออก
    const audioElement = document.getElementById(`audio-${queueNumber}`);
    if (audioElement) {
        //alert(queueNumber);
        isPlaying = true;
        audioElement.play();

        audioElement.onended = () => {
            requeueButton.disabled = false;
            setqueueButton.disabled = false;

            playQueueList();
        };
    }
}

function showLoadingPopup() {
    loadingPopup.style.display = "block";
}

function hideLoadingPopup() {
    loadingPopup.style.display = "none";
}
