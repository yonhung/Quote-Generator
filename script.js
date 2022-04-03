const quoteText = document.querySelector('#quote-text');
const authorText = document.querySelector('#author-text');
const newQuoteBtn = document.querySelector('#new-quote');
const twitterBtn = document.querySelector('#twitter');

let apiQuotes = [];
getQuotes();

// 事件监听器
twitterBtn.addEventListener("click", newTweet);
newQuoteBtn.addEventListener("click", newYiyan);

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
    const response = await fetch("https://quotable.io/quotes?page=1&limit=150");
    if (response.ok) {
      apiQuotes = (await response.json()).results;
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

// --------------
// 获取一言随机名言
// --------------
async function newYiyan() {
  try {
    const response = await fetch("https://v1.hitokoto.cn?c=d&c=h&c=i");
    if (response.ok) {
      const quote = await response.json();
      
      quoteText.textContent = quote.hitokoto;
      // 检查作者是否为空，如果是替换成署名
      if(!quote.from_who) {
        quote.from_who = '';
      }
      authorText.textContent = quote.from_who + "《"+quote.from+"》";
      // 过长的文字缩小字号
      if (quote.hitokoto.length > 80) {
        quoteText.classList.add("quote__text--long");
      } else {
        quoteText.classList.remove("quote__text--long")
      }
    } else {
      throw new Error(response.status);
    }
  } catch (e) {
    console.log(e);
  }
}