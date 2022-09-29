/*
 * @Author: chenzihan
 * @Date: 2022-09-29 16:56:56
 * @LastEditTime: 2022-09-29 18:09:21
 * @LastEditors: chenzihan
 * @Description:
 * @FilePath: \colorExtraction-demo\src\index.js
 */
const { ref, watchEffect, computed, watch } = Vue;

let fileUploadEl = document.getElementsByClassName('fileUpload')[0];
let contentEl = document.getElementsByClassName('content')[0];
let colorDisplayEl = document.getElementsByClassName('color-display')[0];
let colorItemEl = document.getElementsByClassName('color-item')[0];
let colorDescEl = document.getElementsByClassName('color-desc')[0];
let canvas = document.getElementsByClassName('canvas')[0];
let ctx = canvas.getContext('2d');
let options = {
  canvasWidth: 300,
  canvasHeight: 300,
};

function extractColor(e) {
  activeX.value = e.pageX - contentEl.offsetLeft;
  activeY.value = e.pageY - contentEl.offsetTop;
}

function extractStart(e) {
  colorDisplayEl.style.display = 'block';
  document.addEventListener('keydown', copyColor);
}

function extractEnd(e) {
  colorDisplayEl.style.display = 'none';
  document.removeEventListener('keydown', copyColor);
}

function uploadFile() {
  file.value = fileUploadEl.files[0];
}

fileUploadEl.onchange = uploadFile;
contentEl.onmousemove = extractColor;
contentEl.onmouseleave = extractEnd;
contentEl.onmouseenter = extractStart;

// 上传的文件
const file = ref();

// 当前鼠标位置x
const activeX = ref(0);
// 当前鼠标位置y
const activeY = ref(0);
// 当前图块
const activeBlock = computed(() =>
  ctx.getImageData(activeX.value, activeY.value, 1, 1)
);

// 当前的颜色数据
const color = computed(() => (activeBlock.value ? activeBlock.value.data : []));

// 16进制 color
const colorCode = computed(
  () =>
    `#${Array.from(color.value)
      .map((item) => item.toString(16))
      .join('')}`
);

// rgb color
const colorRgb = computed(() => `rgb(${color.value.join(',')})`);

// 颜色描述
const colorDesc = computed(() => colorRgb.value + '<br/>' + colorCode.value);

watchEffect(() => {
  colorDisplayMove(activeX.value, activeY.value);
});

watchEffect(() => {
  colorItemEl.style.backgroundColor = colorRgb.value;
});
watchEffect(() => {
  colorDescEl.innerHTML = colorDesc.value;
});

watchEffect(async () => {
  if (file.value) {
    const image = await fileToImage(file.value);
    drawImage(image);
  }
});

function drawImage(image) {
  clearCanvas();
  options.canvasWidth = image.width;
  options.canvasHeight = image.height;
  initCanvas();
  ctx.drawImage(image, 0, 0, options.canvasWidth, options.canvasHeight);
}

function clearCanvas() {
  ctx.clearRect(0, 0, options.canvasWidth, options.canvasHeight);
}
function initCanvas() {
  contentEl.style.display = 'block';
  contentEl.style.width = options.canvasWidth + 'px';
  contentEl.style.height = options.canvasHeight + 'px';
  canvas.width = options.canvasWidth;
  canvas.height = options.canvasHeight;
}

function fileToImage(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      let image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        resolve(image);
      };
    };
  });
}

function colorDisplayMove(x, y) {
  colorDisplayEl.style.top = y + 'px';
  colorDisplayEl.style.left = x + 'px';
}

function copyColor(e) {
  if ((e.code === 'KeyC' || e.code === 'KeyX') && color.value) {
    let input = document.createElement('input');
    document.body.appendChild(input);
    if (e.code === 'KeyC') {
      input.value = colorRgb.value;
    }
    if (e.code === 'KeyX') {
      input.value = colorCode.value;
    }
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
