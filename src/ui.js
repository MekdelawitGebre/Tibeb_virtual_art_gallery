import { moveCameraTo } from './controls.js';
function initUI(startCallback) {
  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', () => {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById
    startCallback();
  });

  
}



export { initUI };