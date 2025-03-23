// 必要な要素を取得
const timeInput = document.getElementById("timeInput");
const setTimeBtn = document.getElementById("setTimeBtn");
const statusText = document.getElementById("status");
const videoPlayer = document.getElementById("videoPlayer");

let targetTime = null;

// ボタンをクリックして時間をセット
setTimeBtn.addEventListener("click", () => {
    const selectedTime = timeInput.value;
    if (!selectedTime) {
        alert("時間を選択してください");
        return;
    }
    
    targetTime = selectedTime;
    statusText.textContent = `動画は ${targetTime} に再生されます。`;
});

// 毎秒現在時刻をチェック
setInterval(() => {
    if (!targetTime) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM形式

    if (currentTime === targetTime) {
        playVideo();
        targetTime = null; // 一度再生したらリセット
    }
}, 1000);

// 動画を再生する関数
function playVideo() {
    statusText.textContent = "動画を再生中！";
    videoPlayer.play();
}