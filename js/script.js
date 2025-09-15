const text = "欢迎来到我的个人主页！\n这里我会分享我的生活、想法以及各种小趣事。\n希望你能够从中获得一些快乐~";

const editableDiv = document.getElementById('editable');
editableDiv.contentEditable = false;

let i = 0;

// 红色光标
const cursor = document.createElement('span');
cursor.className = 'cursor';
editableDiv.appendChild(cursor);

let typing = true;       // 打字机是否还在打字
let buttonsShown = false; // 按钮是否已经生成过

// 打字机完成后生成按钮
function typeWriter() {
  if (!typing) return;
  if (i < text.length) {
    const span = document.createElement('span');
    span.textContent = text.charAt(i);
    editableDiv.insertBefore(span, cursor);
    i++;
    setTimeout(typeWriter, 100);
  } else {
    typing = false;
    if (!buttonsShown) {
      setupRandomButtons();
      buttonsShown = true;
    }
  }
}

// 点击 editableDiv 打断打字机
editableDiv.addEventListener('click', () => {
  if (cursor.parentNode) cursor.remove();
  editableDiv.contentEditable = true;
  editableDiv.focus();

  if (typing) {
    typing = false; // 停止打字机
    const remainingText = text.slice(i);
    // 用 span 包裹每个字符
    for(const char of remainingText){
      const span = document.createElement('span');
      span.textContent = char;
      editableDiv.appendChild(span);
    }

    setupRandomButtons();
  }
});

window.onload = () => {
  typeWriter();
};

let highestZIndex = 10; // 全局变量，保证最顶层便利贴

function addNoteToPage(title, content, showCloseBtn=false){
  const note = document.createElement('div');
  note.className = "note";

  // ===== 随机位置 =====
const vw = document.documentElement.clientWidth;
const vh = document.documentElement.clientHeight;
const size = 150;

note.style.left = Math.random() * (vw - size) + "px";
note.style.top  = Math.random() * (vh - size) + "px";
  // ===== 随机旋转 =====
  const deg = Math.random()*10 - 5;
  note.style.transform = `rotate(${deg}deg)`;

  // ===== 动态 z-index =====
  note.style.zIndex = ++highestZIndex;

  // ===== 内部内容 =====
  note.innerHTML = `
    ${showCloseBtn ? `<button class="close-btn">×</button>` : ''}
    <div>
      <strong>${title}</strong>
      <div>${content}</div>
    </div>
  `;

  // ===== 关闭按钮逻辑 =====
  if(showCloseBtn){
    note.querySelector(".close-btn").onclick = () => note.remove();
  }

  // ===== 拖拽逻辑（PC + 移动端） =====
  let shiftX = 0, shiftY = 0;

  function startDrag(pageX, pageY){
    const rect = note.getBoundingClientRect();
    shiftX = pageX - rect.left;
    shiftY = pageY - rect.top;
    note.style.zIndex = ++highestZIndex;
  }

  function moveAt(pageX, pageY){
    note.style.left = (pageX - shiftX) + 'px';
    note.style.top  = (pageY - shiftY) + 'px';
  }

  // 鼠标拖动
  note.addEventListener("mousedown", e => {
    startDrag(e.pageX, e.pageY);
    function onMouseMove(e){ moveAt(e.pageX, e.pageY); e.preventDefault(); }
    function onMouseUp(){ document.removeEventListener("mousemove", onMouseMove); document.removeEventListener("mouseup", onMouseUp); }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

note.addEventListener("touchstart", e => {
  const t = e.touches[0];
  const rect = note.getBoundingClientRect();

  // 把当前便利贴放到最上层
  note.style.zIndex = ++highestZIndex;

  // 记录手指在便利贴里的相对位置
  const shiftX = t.clientX - rect.left;
  const shiftY = t.clientY - rect.top;

  function onTouchMove(e) {
    const t = e.touches[0];
    note.style.left = (t.clientX - shiftX) + "px";
    note.style.top  = (t.clientY - shiftY) + "px";
    e.preventDefault(); // 防止页面跟着滚动
  }

  function onTouchEnd() {
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
});

note.ondragstart = () => false;


  // ===== 添加到页面 =====
  document.body.appendChild(note);
}


// 打开小纸条输入框
function openItemModal(item){
  const modalContent = document.createElement('div');
  modalContent.id = "note-modal";

  // 居中显示
  modalContent.style.left = (window.innerWidth - 300)/2 + 'px';
  modalContent.style.top  = (window.innerHeight - 300)/2 + 'px';
  modalContent.style.zIndex = ++highestZIndex;

  modalContent.innerHTML = `
    <button class="close-btn">×</button>
    <div>
      <label>标题：</label>
      <input id="note-title" type="text" placeholder="标题~">
    </div>
    <div>
      <label>内容：</label>
      <textarea id="note-input" rows="5" placeholder="你想说的话或者想分享的事情~如果发送的话我可以看到的哦~"></textarea>
    </div>
    <div>
      <button id="save-note-btn">保存</button>
      <button id="send-note-btn">发送</button>
    </div>
  `;

// ===== 拖拽逻辑 =====
let shiftX = 0, shiftY = 0;

function startDrag(clientX, clientY) {
  const rect = modalContent.getBoundingClientRect();
  shiftX = clientX - rect.left;
  shiftY = clientY - rect.top;
  modalContent.style.zIndex = ++highestZIndex;
}

function moveAt(clientX, clientY) {
  modalContent.style.left = (clientX - shiftX) + "px";
  modalContent.style.top  = (clientY - shiftY) + "px";
}

// PC 端
modalContent.addEventListener("mousedown", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.classList.contains("close-btn")) return;
  e.preventDefault();
  startDrag(e.clientX, e.clientY);

  function onMouseMove(e) { moveAt(e.clientX, e.clientY); }
  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

// 移动端
modalContent.addEventListener("touchstart", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.classList.contains("close-btn")) return;
  const t = e.touches[0];
  startDrag(t.clientX, t.clientY);

  function onTouchMove(e) {
    const t = e.touches[0];
    moveAt(t.clientX, t.clientY);
    e.preventDefault(); // 防止页面滚动
  }
  function onTouchEnd() {
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
});

modalContent.ondragstart = () => false;


  // 关闭按钮
  modalContent.querySelector(".close-btn").onclick = () => modalContent.remove();

  document.body.appendChild(modalContent);

  
// 保存按钮（只生成便利贴）
modalContent.querySelector("#save-note-btn").onclick = () => {
  const title = modalContent.querySelector("#note-title").value.trim();
  const content = modalContent.querySelector("#note-input").value.trim();
  if (title || content) {
    addNoteToPage(title || "小纸条", content, true);
    modalContent.remove();
  } else {
    alert("请输入标题或内容哦~");
  }
};

// 新增发送按钮（生成便利贴 + 发送表单）
modalContent.querySelector("#send-note-btn").onclick = () => {
  const title = modalContent.querySelector("#note-title").value.trim();
  const content = modalContent.querySelector("#note-input").value.trim();
  if (title || content) {
    addNoteToPage(title || "小纸条", content, true);

    // 发送表单
    fetch("https://formbold.com/s/oa00y", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: content })
    })
      .then(res => {
        if(res.ok) console.log("提交成功！");
        else console.error(res.statusText);
      })
      .catch(err => console.error("网络错误", err));

    modalContent.remove();
  } else {
    alert("请输入标题或内容哦~");
  }
};}

// 创建随机按钮
function setupRandomButtons(){
  const buttonData = [
    {text: "天气", content: "小心下雨，注意气温~"},
    {text: "周记", content: "这周没干啥，做了个网页就很开心~"},
    {text: "音乐", content: "本周给你推荐的歌是《听书》~"},
    {text: "美食记", content: "在阳阳吃的红烧牛肉面还不错~"},
    {text: "本周所思", content: "什么时候才能找到工作哎~"},
    {text: "深夜感想", content: "原来人活着也有这么累的时候~"}, 
    {text: "待办事项", content: "希望你没有待办事项~"},
    {text: "更新计划", content: "应该是不定期的，最迟一周一更~"},
    {text: "小秘密", content: "网页上的字可以编辑的~"},
    {text: "写张小纸条吧", content: ""}
  ];
  createRandomButtons(buttonData);
}


// 随机按钮生成
function createRandomButtons(dataArray){
  const main = document.querySelector('main');
  const usedRects = [];

  dataArray.forEach(item=>{
    const btn = document.createElement('button');
    btn.textContent = item.text;
    btn.className = 'random-btn';

    let x,y,overlap,attempts=0;
    do{
      overlap=false;
      const maxX = main.clientWidth-150;
      const maxY = main.clientHeight-50;
      const minY = 150;
      x = Math.random() * maxX;
      y = minY + Math.random() * (maxY - minY);
      const rect = {x,y,w:150,h:50};
      for(const r of usedRects){
        if(!(rect.x+rect.w<r.x||rect.x>r.x+r.w||rect.y+rect.h<r.y||rect.y>r.y+r.h)){
          overlap = true; 
          break;
        }
      }
      attempts++;
      if(attempts>50) break;
    } while(overlap);
    usedRects.push({x,y,w:150,h:50});

    // 随机旋转
    const deg = Math.random()*20-10;
    btn.style.transform = `rotate(${deg}deg)`;
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';

    // 按钮点击逻辑
    btn.onclick = ()=>{ 
      if(item.text === "写张小纸条吧"){
        openItemModal(item);
        btn.remove();
        setTimeout(() => {
          createRandomButtons([{text:"写张小纸条吧", content:""}]);
        }, 50);
      } else { 
        addNoteToPage(item.text, item.content, false); 
        btn.remove();
      }
    };

    main.appendChild(btn);
  });
}

// header h1、h2 可编辑初始化
document.querySelectorAll("header h1, header h2").forEach(el => {
  el.setAttribute("contenteditable", "true");
});
// ===== header h1 可编辑逻辑 =====
(function(){
  const defaultTitle = "何炜坤的个人主页";
  const h1 = document.querySelector("header h1");
  if (!h1) return;

  h1.setAttribute("contenteditable", "true");
  h1.dataset.placeholder = defaultTitle;

  function isReallyEmpty(el) {
    const txt = (el.textContent || "").replace(/\u200B/g,"").replace(/\u00A0/g,"").trim();
    return txt === "";
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if (isReallyEmpty(h1)) h1.innerHTML = "&nbsp;";
  document.title = isReallyEmpty(h1) ? defaultTitle : h1.textContent.trim();

  h1.addEventListener("input", () => {
    if (isReallyEmpty(h1)) {
      h1.innerHTML = "&nbsp;";
      placeCaretAtEnd(h1);
      document.title = "快起一个标题啦";
    } else {
      const text = h1.textContent.replace(/\u00A0/g, " ").trim();
      document.title = text || defaultTitle;
    }
  });

  h1.addEventListener("focus", () => { if(isReallyEmpty(h1)){ h1.innerHTML = "&nbsp;"; placeCaretAtEnd(h1); } });
  h1.addEventListener("blur", () => { if(isReallyEmpty(h1)) h1.innerHTML=""; });
  h1.addEventListener("keydown", e => { if(e.key==="Enter") e.preventDefault(); });
})();

// ===== header h2 可编辑逻辑 =====
(function(){
  const defaultH2Title = "这是一个神奇的小天地";
  const h2 = document.querySelector("header h2");
  if (!h2) return;

  h2.setAttribute("contenteditable", "true");
  h2.dataset.placeholder = defaultH2Title;

  function isReallyEmpty(el) {
    const txt = (el.textContent || "").replace(/\u200B/g,"").replace(/\u00A0/g,"").trim();
    return txt === "";
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if(isReallyEmpty(h2)) h2.innerHTML="&nbsp;";

  h2.addEventListener("input", () => { if(isReallyEmpty(h2)){ h2.innerHTML="&nbsp;"; placeCaretAtEnd(h2); } });
  h2.addEventListener("focus", () => { if(isReallyEmpty(h2)){ h2.innerHTML="&nbsp;"; placeCaretAtEnd(h2); } });
  h2.addEventListener("blur", () => { if(isReallyEmpty(h2)) h2.innerHTML=""; });
  h2.addEventListener("keydown", e => { if(e.key==="Enter") e.preventDefault(); });
})();
