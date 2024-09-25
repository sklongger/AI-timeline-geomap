// 导入必要的库
import { MediaRecorder } from 'extendable-media-recorder';

// 定义存放录屏数据的数组
let recordedChunks = [];

// 定义媒体录制器
let mediaRecorder;
let stream;

const recordVideo = async () => {
    try {
        // 获取屏幕共享流
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: { ideal: 12 },
            },
            // videoBitsPerSecond: 160000000,
            audio: false,
        });


        // 创建媒体录制器
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 1600000,
        });

        // 添加媒体录制器事件监听器
        mediaRecorder.ondataavailable = (event) => {
            // 将录制的数据添加到数组中
            console.log('recording!!!')
            console.log(event.data)
            recordedChunks.push(event.data);
        };

        // 开始录制
        mediaRecorder.start();

    } catch (error) {
        // 处理错误
        console.log('recording error!!!')
        console.error(error);
    }
}

const stopRecordVideo = async () => {
    mediaRecorder.stop()
    await new Promise(resolve => mediaRecorder.onstop = resolve);
    const blob = new Blob(recordedChunks, { type: 'video/webm' });

    // 创建一个下载链接
    const url = URL.createObjectURL(blob);

    // 创建一个下载按钮
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'recording.webm';
    downloadLink.click();

    // 清理下载链接
    stream.getTracks().forEach(track => track.stop());
    URL.revokeObjectURL(url);

    // 清理录制数据数组
    recordedChunks = [];
}

export { recordVideo, stopRecordVideo }