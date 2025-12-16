const api_key = 'e43e60b60d8644a09e9722df8217786e';  // 替换为你自己的 API 密钥

// const api_key = 'YOUR_API_KEY';  // 替换为你自己的 API 密钥
const news_api_url = `https://newsapi.org/v2/everything?q=world&sortBy=publishedAt&apiKey=${api_key}`;  // 新闻 API 请求 URL

// 格式化日期为指定格式：YYYY年MM月DD日
function format_date(date) {
  const year = date.getFullYear();  // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 获取月份，确保是2位
  const day = String(date.getDate()).padStart(2, '0');  // 获取日期，确保是2位

  return `${year}年${month}月${day}日`;  // 返回格式化后的日期
}

// 获取今天的日期并显示
function fetch_and_display_today_date() {
  fetch(news_api_url)
    .then(response => {
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      return response.json();  // 解析返回的 JSON 数据
    })
    .then(data => {
      if (!data || !data.articles || data.articles.length === 0 || !data.articles[0].publishedAt) {
        throw new Error('No valid article data');
      }

      // 提取第一条新闻的发布时间作为“今天”的日期
      const published_date = new Date(data.articles[0].publishedAt);  // 获取新闻的发布时间
      const formatted_date = format_date(published_date);  // 格式化日期为指定格式

      // 在页面中显示今天的日期
      document.getElementById('date_display').innerHTML = `今天是：${formatted_date}`;
    })
    .catch(error => {
      console.error('Error fetching news data:', error);  // 错误处理

      // 使用本地时间并停用自动刷新
      const localDate = new Date();
      const formatted_local = format_date(localDate);
      document.getElementById('date_display').innerHTML = `失败，显示本地时间：${formatted_local}（已停止自动刷新）`;

      if (typeof refreshInterval !== 'undefined' && refreshInterval !== null) {
        clearInterval(refreshInterval);
      }
    });
}

// 启动自动刷新：每隔60秒重新获取并显示（可按需调整间隔，单位：毫秒）
// 保存返回值以便在失败时可以停止自动刷新
let refreshInterval = setInterval(fetch_and_display_today_date, 60 * 1000);

// 立即执行一次
fetch_and_display_today_date();