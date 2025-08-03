let questions = [];
let currentFull = "";
let currentIdx = -1;

// 读取 title.txt
function loadQuestionsFromTxt() {
  fetch("title.txt")
    .then((response) => response.text())
    .then((text) => {
      questions = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      nextQuestion();
    })
    .catch(() => {
      document.getElementById("question").innerText = "无法加载 title.txt";
    });
}

function randomIndex() {
  return Math.floor(Math.random() * questions.length);
}

function nextQuestion() {
  if (questions.length === 0) {
    document.getElementById("question").innerText = "题库为空";
    document.getElementById("questionNo").innerText = "";
    currentFull = "";
    currentIdx = -1;
    return;
  }
  let idx = randomIndex();
  currentFull = questions[idx];
  currentIdx = idx;
  let shortQ =
    currentFull.length > 20 ? currentFull.slice(0, 20) + "..." : currentFull;
  document.getElementById("question").innerText = shortQ;
  document.getElementById("questionNo").innerText = "题目编号：" + idx;
}

function copyQuestion() {
  if (!currentFull) return;
  navigator.clipboard.writeText(currentFull);
}

// 点击题目弹窗显示完整内容
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("question").onclick = function () {
    if (!currentFull) return;
    showDialog(currentFull, currentIdx);
  };
  loadQuestionsFromTxt();
});

// 简单弹窗
function showDialog(text, idx) {
  let dlg = document.createElement("div");
  dlg.style.position = "fixed";
  dlg.style.left = 0;
  dlg.style.top = 0;
  dlg.style.width = "100vw";
  dlg.style.height = "100vh";
  dlg.style.background = "rgba(0,0,0,0.18)";
  dlg.style.display = "flex";
  dlg.style.alignItems = "center";
  dlg.style.justifyContent = "center";
  dlg.innerHTML = `
          <div style="background:#fff;border-radius:12px;box-shadow:0 2px 12px #0002;padding:28px 22px 18px 22px;max-width:340px;min-width:220px;">
            <div style="font-size:15px;color:#1976d2;margin-bottom:6px;">题目编号：${idx}</div>
            <div style="font-size:16px;color:#333;word-break:break-all;margin-bottom:18px;">${text}</div>
            <button class="btn" onclick="navigator.clipboard.writeText(\`${text.replace(
              /`/g,
              "\\`"
            )}\`)">复制问题</button>
            <button class="btn" onclick="this.parentNode.parentNode.remove()">关闭</button>
            <div style="font-size:12px;color:#888;margin-top:8px;">双击弹窗可关闭并自动切换下一个</div>
          </div>
        `;
  dlg.ondblclick = function () {
    dlg.remove();
    nextQuestion();
  };
  document.body.appendChild(dlg);
}
