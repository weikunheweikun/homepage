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
  } else {typing=false;
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
  editableDiv.appendChild(document.createTextNode(remainingText));
}
});

// 添加便利贴
function addNoteToPage(title, content, showCloseBtn=false){
  const note = document.createElement('div');
  note.className = "note";

  const size = 200;
  note.style.width = size + "px";
  note.style.height = size + "px";
  note.style.position = "absolute";
  note.style.left = (100 + Math.random()*300) + "px";
  note.style.top = (100 + Math.random()*300) + "px";
  note.style.padding = "12px";
  note.style.background = "#fff9c4";
  note.style.border = "2px solid #d4af37";
  note.style.borderRadius = "6px";
  note.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.2)";
  note.style.cursor = "move";
  note.style.transform = `rotate(${(Math.random()*10-5)}deg)`;
  note.style.overflow = "hidden";
  note.style.wordBreak = "break-word";
  note.style.boxSizing = "border-box";

  note.innerHTML = `
    <div style="position:relative;width:100%;height:100%;">
      ${showCloseBtn ? `<button class="close-btn" 
              style="position:absolute;top:-6px;right:4px;
                     width:22px;height:22px;
                     border:2px solid #FFA500; 
                     background:#FFB84D;
                     color:black;
                     font-weight:bold;font-size:14px;
                     line-height:18px;
                     border-radius:4px;cursor:pointer;
                     display:flex;align-items:center;justify-content:center;
                     padding:0;">×</button>` : ''}
      <div style="text-align:left;margin-top:0;margin-left:5px;font-size:20px">
        <strong>${title}</strong>
        <div style="font-size:16px;margin-top:8px; line-height:1.5;">${content}</div>
      </div>
    </div>
  `;

  if(showCloseBtn){
    note.querySelector(".close-btn").onclick = ()=> note.remove();
  }

  // 拖动功能
  note.onmousedown = function(e){
    let shiftX = e.clientX - note.getBoundingClientRect().left;
    let shiftY = e.clientY - note.getBoundingClientRect().top;

    function moveAt(pageX, pageY) { note.style.left = pageX - shiftX + 'px'; note.style.top = pageY - shiftY + 'px'; }

    function onMouseMove(e) { moveAt(e.pageX, e.pageY); }

    document.addEventListener('mousemove', onMouseMove);
    note.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      note.onmouseup = null;
    };
  };
  note.ondragstart = () => false;

  document.body.appendChild(note);
}

// 打开小纸条输入框（直接在页面生成，不用遮罩背景）
function openItemModal(item){
  const modalContent = document.createElement('div');
  modalContent.id = "note-modal";
  modalContent.style.position = "absolute";
  modalContent.style.left = "50%";
  modalContent.style.top = "50%";
  modalContent.style.transform = "translate(-50%, -50%)";
  modalContent.style.width = "300px";
  modalContent.style.height = "300px";
  modalContent.style.background = "#fff9c4";
  modalContent.style.border = "2px solid #d4af37";
  modalContent.style.borderRadius = "6px";
  modalContent.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.2)";
  modalContent.style.padding = "12px";
  modalContent.style.boxSizing = "border-box";

  modalContent.innerHTML = `
    <button class="close-btn" 
            style="position:absolute;top:-6px;right:4px;
                   width:22px;height:22px;
                   border:2px solid #FFA500; 
                   background:#FFB84D;
                   color:black;
                   font-weight:bold;font-size:14px;
                   line-height:18px;
                   border-radius:4px;
                   cursor:pointer;
                   display:flex;align-items:center;justify-content:center;
                   padding:0;">×</button>
    <div style="margin-top:10px;">
      <label>标题：</label>
      <input id="note-title" type="text"placeholder="标题~"
        style="display:block;width:90%;margin:12px auto;
               padding:4px 6px;border:2px solid #2E4E3D;border-radius:6px;
               font-size:16px;">
    </div>
    <div style="margin-top:6px;">
      <label>内容：</label>
      <textarea id="note-input" rows="5"placeholder="你想说的话或者想分享的事情~我可以看到的哦~"
        style="display:block;margin:4px auto;width:90%;
               border:2px solid #2E4E3D;border-radius:6px;
               padding:4px 6px;resize:none;font-size:16px;"></textarea>
    </div>
    <div style="text-align:center;margin-top:8px">
      <button id="save-note-btn"
        style="padding:0px 14px;border:2px solid #2E4E3D;border-radius:6px;
               background:#fff;cursor:pointer;">保存</button>
    </div>
  `;

  // 关闭按钮
  modalContent.querySelector(".close-btn").onclick = () => modalContent.remove();
  document.body.appendChild(modalContent);

  // 保存按钮
  modalContent.querySelector("#save-note-btn").onclick = () => {
    const title = modalContent.querySelector("#note-title").value.trim();
    const content = modalContent.querySelector("#note-input").value.trim();
    if(title || content){
      addNoteToPage(title || "小纸条", content, true); // 小纸条带关闭 ×

      // === 提交到 Formbold ===
      fetch("https://formbold.com/s/oa00y", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title, content: content })
      })
      .then(res => { if(res.ok) console.log("提交成功！"); else console.error(res.statusText); })
      .catch(err => console.error("网络错误", err));

      modalContent.remove();
    } else {
      alert("请输入标题或内容哦~");
    }
  };
}

// 创建随机按钮
function setupRandomButtons(){
  const buttonData = [
    {text: "天气", content: "小心下雨，注意气温~"},
    {text: "周记", content: "这周没干啥，做了个网页就很开心~"},
    {text: "音乐", content: "本周给你推荐的歌是《听书》~"},
    {text: "美食记", content: "在阳阳吃的红烧牛肉面还不错哦~"},
    {text: "本周所思", content: "什么时候才能找到工作哎~"},
    {text: "深夜感想", content: "原来人活着也有这么累的时候嘛~"},
    {text: "待办事项", content: "希望你没有待办事项哦~"},
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
      x=Math.random()*maxX;
      y=minY+Math.random()*(maxY-minY);
      const rect={x,y,w:150,h:50};
      for(const r of usedRects){
        if(!(rect.x+rect.w<r.x||rect.x>r.x+r.w||rect.y+rect.h<r.y||rect.y>r.y+r.h)){
          overlap=true; break;
        }
      }
      attempts++;
      if(attempts>50) break;
    }while(overlap);
    usedRects.push({x,y,w:150,h:50});

    const deg = Math.random()*20-10;
    btn.style.transform = `rotate(${deg}deg)`;
    btn.style.left = x+'px';
    btn.style.top = y+'px';
    btn.style.background = "#FAF1D8"; // 固定按钮背景色
    btn.style.border = "2px solid #2E4E3D";
    btn.style.color = "#000";

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