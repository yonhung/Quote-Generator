const quoteContainer = document.querySelector('#quote-container');
const quoteText = document.querySelector('#quote-text');
const authorText = document.querySelector('#author-text');
const newQuoteBtn = document.querySelector('#new-quote');
const twitterBtn = document.querySelector('#twitter');
const loader = document.querySelector('#loader');

let apiQuotes = [];
getQuotes();

// 事件监听器
twitterBtn.addEventListener("click", newTweet);
newQuoteBtn.addEventListener("click", newQuote);

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
    quoteText.classList.remove("quote__text--long")
  }
}

// ---------------------------------
// 从api中获取一组名人名言存到apiQuotes
// ----------------------------------
async function getQuotes() {
  try {
    loading();
    const response = await fetch("https://quotable.io/quotes?page=1&limit=150");
    if (response.ok) {
      apiQuotes = (await response.json()).results;
      complete();
      newQuote();
    } else {
      throw new Error(response.status)
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

// =======
// 等待画面
// =======
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function complete() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}