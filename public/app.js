const enqueueButton = document.getElementById('enqueue-button');
const newbutton = document.getElementById('newnum');
const currentQueueElement = document.getElementById('current-queue');
const queueAudio = document.getElementById('queue-audio');
const loadingPopup = document.getElementById('loading-popup');

let currentQueue = 0;
let isPlaying = false;
let timer=0;

const requeueButton = document.getElementById('requeue-button');
const requeuePopup = document.getElementById('requeue-popup');
const confirmRequeueButton = document.getElementById('confirm-requeue-button');
const cancelRequeueButton = document.getElementById('cancel-requeue-button');
const requeueInput = document.getElementById('requeue-input');

const setqueueButton = document.getElementById('setnum');
const setqueuePopup = document.getElementById('setqueue-popup');
const confirmsetButton = document.getElementById('confirm-set-button');
const cancelsetButton = document.getElementById('cancel-set-button');
const setqueueInput = document.getElementById('set-input');

function testaudio() {
            if (isPlaying) {
                return; // ไม่สามารถเริ่มเล่นเสียงใหม่ได้ถ้ากำลังมีการเล่นเสียงอื่น ๆ อยู่
            }
            const audioElement3 = document.getElementById(`testsound`);
            //const test = "https://cdn.glitch.global/5e8236f5-2ff9-478e-8f63-21a9df7a5ea2/cafeamazon.mp3?v=1700096312473";
            audioElement3.play();
            //audio3.close();
            //alert(test);
        }
let intervalId22 = setInterval(testaudio,600000);
function chkcon() {
            // สร้างการโหลดค่าคิวจากหน้า index ด้วย JavaScript (โดยใช้ XMLHttpRequest หรือ Fetch API)
            // แล้วอัปเดตค่าคิวในหน้านี้
            
            fetch('/chk')  // สมมติว่าเรามีเส้นทาง '/get-current-queue' ในเซิร์เวอร์
                .then(response => response.json())
                .then(data => {
                    console.log('การเชื่อมต่อสมบูรณ์');
                    enqueueButton.disabled = false;
                    newbutton.disabled = false;
                    setqueueButton.disabled = false;
                    updateQueueDisplay();
                    
                    
                })
                .catch(error => {
                    document.getElementById('current-queue').textContent = "อินเทอร์เน็ตขัดข้อง กรุณาใช้ปุ่ม 'เรียกซ้ำ'";
                    //rewin();
                    enqueueButton.disabled = true;
                    newbutton.disabled = true;
                    setqueueButton.disabled = true;
                    
                    
                });
         
                
        }
setInterval(chkcon, 10000);
timer=600000;


requeueButton.addEventListener('click', () => {
    requeueButton.disabled = true;
    requeuePopup.style.display = 'block';
    requeueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
});

confirmRequeueButton.addEventListener('click', () => {
    const requeuedQueue = parseInt(requeueInput.value);
    if (!isNaN(requeuedQueue)&&requeuedQueue<100) {
        playQueueSound(requeuedQueue);
        enqueueButton.disabled = false;
        requeuePopup.style.display = 'none';
        requeueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
    } else {
        alert('กรุณาป้อนเลขคิวที่ถูกต้อง');
    }
});

cancelRequeueButton.addEventListener('click', () => {
    requeueButton.disabled = false;
    requeuePopup.style.display = 'none';
    requeueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
});


//ส่วนของเรียกซ้ำ

setqueueButton.addEventListener('click', () => {
    setqueueButton.disabled = true;
    setqueuePopup.style.display = 'block';
    setqueueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
});

confirmsetButton.addEventListener('click', () => {
    const setQueue = parseInt(setqueueInput.value);
    if (!isNaN(setQueue)&setQueue<100) {
        //playQueueSound(setQueue);
        currentQueue=setQueue;
        //alert(currentQueue);
        sendSSEMessage(setQueue);
        enqueueButton.disabled = false;
        setqueuePopup.style.display = 'none';
        setqueueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
    } else {
        alert('กรุณาป้อนเลขคิวที่ถูกต้อง');
    }
});

cancelsetButton.addEventListener('click', () => {
    setqueueButton.disabled = false;
    setqueuePopup.style.display = 'none';
    setqueueInput.value = ''; // เคลียร์ค่าในช่องป้อนเลขคิว
});

//ส่วนของตั้งคิว

function updateQueueDisplay() {
            // สร้างการโหลดค่าคิวจากหน้า index ด้วย JavaScript (โดยใช้ XMLHttpRequest หรือ Fetch API)
            // แล้วอัปเดตค่าคิวในหน้านี้
            fetch('/get-current-queue')  // สมมติว่าเรามีเส้นทาง '/get-current-queue' ในเซิร์เวอร์
                .then(response => response.json())
                .then(data => {
                    document.getElementById('current-queue').textContent = data.queue;
                    currentQueue=data.queue;
                })
                .catch(error => {
                    console.error('เกิดข้อผิดพลาดในการดึงค่าคิว:', error);
                });
        }

        // อัปเดตค่าคิวทุกๆ 5 วินาที (หรือความถี่ที่คุณต้องการ)
updateQueueDisplay();

function sendSSEMessage(action) {
    //isPlaying = false;
    const sseEndpoint = '/sse?action=' + action;
    const eventSource = new EventSource(sseEndpoint);

    eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'queue') {
            //currentQueue = message.queue;
            clearInterval(intervalId22); // หยุดการนับเวลาเดิม
            
            intervalId22 = setInterval(testaudio,600000);
          
            
            showLoadingPopup();

        // รอเวลา 5 วินาทีก่อนที่จะเริ่มเล่นเสียง
            setTimeout(() => {
            playQueueSound(message.queue);
            enqueueButton.disabled = false;
            // ซ่อน Popup เมื่อเสียงเสร็จสิ้น
            hideLoadingPopup();
            }, 1500);
          currentQueueElement.textContent = message.queue;
          eventSource.close();
          
          //updateQueueDisplay();
        }
        if(message.type === 'renum'){
            
            
            currentQueue=0;
            currentQueueElement.textContent = message.queue;
            eventSource.close();
        }
        if(message.type === 'set'){
            clearInterval(intervalId22); // หยุดการนับเวลาเดิม
            
            intervalId22 = setInterval(testaudio,600000);
            
            showLoadingPopup();

        // รอเวลา 5 วินาทีก่อนที่จะเริ่มเล่นเสียง
            setTimeout(() => {
            playQueueSound(message.queue);
            enqueueButton.disabled = false;
            // ซ่อน Popup เมื่อเสียงเสร็จสิ้น
            hideLoadingPopup();
            }, 1500);
            currentQueueElement.textContent = message.queue;
            eventSource.close();
        }
    };

    eventSource.onerror = (error) => {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ SSE:', error);
    };
  //updateQueueDisplay();
    
}

enqueueButton.addEventListener('click', () => {
    //alert(currentQueue);
    if (!isPlaying&currentQueue<99) {
        
      
        enqueueButton.disabled = true;
        currentQueueElement.textContent = 'กำลังโหลด...';
        currentQueue++;
        //updateQueueDisplay();
        sendSSEMessage('enqueue'); // ส่งคำร้องขอ SSE ที่ระบุการเพิ่มคิว
    }
    else{
        currentQueue=1;
        enqueueButton.disabled = true;
        currentQueueElement.textContent = 'กำลังโหลด...';
        //currentQueue++;
        //alert(currentQueue);
        //updateQueueDisplay();
        sendSSEMessage('enqueue');
      
    }
});
newbutton.addEventListener('click', () => {
        sendSSEMessage('newnum'); // ส่งคำร้องขอ SSE ที่ระบุการเพิ่มคิว
    
});



function playQueueSound(queueNumber) {
    if (isPlaying) {
        return; // ไม่สามารถเริ่มเล่นเสียงใหม่ได้ถ้ากำลังมีการเล่นเสียงอื่น ๆ อยู่
    }
    const audioElement1 = document.getElementById(`audio-${queueNumber}`);
    const audioElement2 = audioElement1.cloneNode(true);
    if (audioElement1 && audioElement2) {
        isPlaying = true;

        // Play the first audio file
        audioElement1.play();

        // When the first audio file ends, play the second one
        audioElement1.onended = () => {
            const delay = 2000;

            setTimeout(() => {
                audioElement2.play();
            }, delay);
        };

        // When the second audio file ends, set isPlaying to false
        audioElement2.onended = () => {
            isPlaying = false;
            requeueButton.disabled = false;
            setqueueButton.disabled = false;
        };
    }
/*
    // เล่นเสียงคิวตามคิวที่รับมาจาก SSE
    const audioFile = `https://cdn.glitch.global/5e8236f5-2ff9-478e-8f63-21a9df7a5ea2/${queueNumber}.mp3`;
    const audioFile2 = `https://cdn.glitch.global/5e8236f5-2ff9-478e-8f63-21a9df7a5ea2/${queueNumber}.mp3`;
    const audio1 = new Audio(audioFile);
    const audio2 = new Audio(audioFile2);
    //alert(audioFile);
    isPlaying = true; // ตั้งค่า isPlaying เป็น true เมื่อเริ่มการเล่น

    // เล่นไฟล์เสียงครั้งแรก
    audio1.play();

    // เมื่อเสรจสิ้นการเล่นครั้งแรก
    audio1.onended = () => {
        // ระยะเวลาดีเลย์ (เช่น 1000 มิลลิวินาที หรือ 1 วินาที)
        const delay = 1500;

        // รอเวลาดีเลย์แล้วเล่นครั้งที่สอง
        setTimeout(() => {
            audio2.play();
        }, delay);
    };

    // เมื่อเสร็จสิ้นการเล่นครั้งที่สอง
    audio2.onended = () => {
        isPlaying = false; // เมื่อเสร็จสิ้นการเล่นทั้งสองครั้ง ตั้งค่า isPlaying เป็น false
        requeueButton.disabled = false;
        setqueueButton.disabled = false;
        audio1.close();
        audio2.close();
    };*/
    
}
function showLoadingPopup() {
    loadingPopup.style.display = 'block';
}

function hideLoadingPopup() {
    loadingPopup.style.display = 'none';
}

//initSSE(); // เรียกใช้ฟังก์ชันเพื่อเริ่มการใช้ SSE
