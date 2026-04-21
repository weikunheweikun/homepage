const pageHeight=document.body.scrollHeight;

/* desktop bubbles */

if(window.innerWidth > 700){

const colors=[
"rgba(230,57,70,0.35)",
"rgba(58,134,255,0.35)",
"rgba(255,190,11,0.35)"
];

const spacing=300;
const rows=Math.ceil(pageHeight/spacing);

const leftMin=5;
const leftMax=20;

const rightMin=70;
const rightMax=90;

for(let i=0;i<rows;i++){

const y=i*spacing+Math.random()*120;

/* 左侧 */

const leftBubble=document.createElement("div");

leftBubble.className="bubble-bg";

const size=70+Math.random()*80;

leftBubble.style.width=size+"px";
leftBubble.style.height=size+"px";

leftBubble.style.left=(leftMin+Math.random()*(leftMax-leftMin))+"vw";
leftBubble.style.top=y+"px";

leftBubble.style.background=
colors[Math.floor(Math.random()*colors.length)];

leftBubble.style.animationDuration=
(14+Math.random()*10)+"s";

document.body.appendChild(leftBubble);

/* 右侧 */

const rightBubble=document.createElement("div");

rightBubble.className="bubble-bg";

const size2=70+Math.random()*80;

rightBubble.style.width=size2+"px";
rightBubble.style.height=size2+"px";

rightBubble.style.left=(rightMin+Math.random()*(rightMax-rightMin))+"vw";
rightBubble.style.top=(y+Math.random()*80)+"px";

rightBubble.style.background=
colors[Math.floor(Math.random()*colors.length)];

rightBubble.style.animationDuration=
(14+Math.random()*10)+"s";

document.body.appendChild(rightBubble);

}

}


/* mobile bubbles */

if(window.innerWidth <= 700){

const mobileColors=[
"rgba(230,57,70,0.2)",
"rgba(58,134,255,0.2)",
"rgba(255,190,11,0.2)"
];

const rowHeight=250;
const rows=Math.ceil(pageHeight/rowHeight);

for(let r=0;r<rows;r++){

const count=1+Math.floor(Math.random()*2);

for(let i=0;i<count;i++){

const bubble=document.createElement("div");
bubble.className="bubble-bg mobile-bubble";

const size=60+Math.random()*60;

bubble.style.width=size+"px";
bubble.style.height=size+"px";

let left;

const side=Math.random()<0.5?"left":"right";

if(side==="left"){
left=0+Math.random()*10;
}else{
left=90+Math.random()*10;
}

const top=
r*rowHeight+rowHeight/2+(Math.random()*80-40);

bubble.style.left=(left-10)+"vw";
bubble.style.top=top+"px";

bubble.style.background=
mobileColors[Math.floor(Math.random()*mobileColors.length)];

bubble.style.animationDuration=
(16+Math.random()*8)+"s";

document.body.appendChild(bubble);

}

}

}




document.addEventListener('DOMContentLoaded', () => {
    // 检查当前页面是否禁用了动画
    if (document.body.classList.contains('no-animation-page')) {
        return; // 如果有这个类，直接跳过下面的动画逻辑
    }

    // 原有的动画逻辑
    document.querySelectorAll('.blog-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});