const quoteContainer = document.querySelector("#quote-container");
const quoteText = document.querySelector("#quote-text");
const authorText = document.querySelector("#author-text");
const newQuoteBtn = document.querySelector("#new-quote");
const twitterBtn = document.querySelector("#twitter");
const loader = document.querySelector("#loader");
const copyQuoteBtn = document.querySelector("#copy-quote");
const copiedQuoteBtn = document.querySelector("#copied-quote");

let apiQuotes = [];
newYiyan();
// getQuotes();

// 事件监听器
twitterBtn.addEventListener("click", newTweet);
newQuoteBtn.addEventListener("click", newYiyan);
copyQuoteBtn.addEventListener("click", copyQuote);

// ------------------------------
// apiQutes随机选取并显示一条名人名言
// -------------------------------
function newQuote() {
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  quoteText.textContent = quote.content;

  // 检查作者是否为空，如果是替换成署名
  if (!quote.author) {
    authorText.textContent = "unknown";
  } else {
    authorText.textContent = quote.author;
  }
  // 过长的文字缩小字号
  if (quote.content.length > 80) {
    quoteText.classList.add("quote__text--long");
  } else {
    quoteText.classList.remove("quote__text--long");
  }
}

// ---------------------------------
// 从quotable api中获取一组名人名言存到apiQuotes
// ----------------------------------
async function getQuotes() {
  try {
    const response = await fetch("https://quotable.io/quotes?page=1&limit=150");
    if (response.ok) {
      apiQuotes = (await response.json()).results;
    } else {
      throw new Error(response.status);
    }
  } catch (e) {
    console.log(e);
  }
}

// -------------
// 将名言发到推特
// -------------
function newTweet() {
  let twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} 
  --- ${authorText.textContent}`;
  window.open(encodeURI(twitterUrl), "_blank");
}

// --------------
// 获取一言随机名言
// --------------
function newYiyan() {
  let errorCounter = 0;
  getNewOne();
  async function getNewOne() {
    try {
      showLoadingSpinner();
      const response = await fetch("https://v1.hitokoto.cn?c=d&c=h&c=i");
      if (response.ok) {
        const quote = await response.json();

        quoteText.textContent = quote.hitokoto;
        // 检查作者是否为空，如果是替换佚名
        if (!quote.from_who) {
          quote.from_who = "佚名";
        }

        // 过长的文字则缩小字号
        if (quote.hitokoto.length > 30) {
          quoteText.classList.add("quote__text--long");
        } else {
          quoteText.classList.remove("quote__text--long");
        }

        //格式化名人名言
        quote.from = quote.from.replace(/[《》]/g, "");
        //成功写入
        authorText.textContent = quote.from_who + "《" + quote.from + "》";
        errorCounter = 0;
        removeLoadingSpinner();
        removeCopiedButton();
      } else {
        throw new Error(response.status);
      }
    } catch (e) {
      console.log(e);
      // 出错则最多再重试十次
      if (errorCounter >= 10) {
        removeLoadingSpinner();
        quoteContainer.innerHTML = "出问题了！要不刷新试试 ◑﹏◐";
      } else {
        getNewOne();
        errorCounter++;
      }
    }
  }
}

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

function showCopiedButton() {
  copyQuoteBtn.hidden = true;
  copiedQuoteBtn.hidden = false;
}

function removeCopiedButton() {
  copyQuoteBtn.hidden = false;
  copiedQuoteBtn.hidden = true;
}

function copyQuote() {
  try {
    showCopiedButton();
    // Clipboard Api 实现写入剪贴板
    const clipboard = navigator.clipboard;
    clipboard.writeText(quoteText.textContent);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
}
