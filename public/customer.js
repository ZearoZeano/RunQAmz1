/*const currentQueueElement = document.getElementById('current-queue');
    const sseEndpoint = '/sse?action=read';
    const eventSource = new EventSource(sseEndpoint);

    eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'showQ') {
            //currentQueue = message.queue;
          currentQueueElement.textContent = message.showQ;  
          //updateQueueDisplay();
        }
        else{
          currentQueueElement.textContent = message.showQ; 
        }
    eventSource.close();
    };

    eventSource.onerror = (error) => {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ SSE:', error);
    };*/