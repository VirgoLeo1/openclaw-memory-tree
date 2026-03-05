const https = require('https');

// 使用 wttr.in API (无需 API key)
const url = 'https://wttr.in/Dezhou?format=j1';

const req = https.get(url, (res) => {
  let responseBody = '';
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    try {
      const weather = JSON.parse(responseBody);
      
      console.log('🌤️ 德州市天气预报\n');
      
      // 当前天气
      const current = weather.current_condition[0];
      console.log('📍 当前天气:');
      console.log(`   温度：${current.temp_C}°C`);
      console.log(`   体感：${current.FeelsLikeC}°C`);
      console.log(`   天气：${current.desc_zh || current.weatherDesc[0].value}`);
      console.log(`   风速：${current.windspeedKmph} km/h, ${current.winddir16Point}`);
      console.log(`   湿度：${current.humidity}%`);
      console.log(`   更新时间：${current.observation_time}\n`);
      
      // 未来预报
      console.log('📅 未来预报:');
      weather.weather.forEach((day, i) => {
        const date = new Date(day.date);
        const dayNames = ['今天', '明天', '后天', '大后天', '第 5 天'];
        console.log(`\n${dayNames[i] || date.toISOString().split('T')[0]} (${day.date}):`);
        console.log(`   最高：${day.maxtempC}°C | 最低：${day.mintempC}°C`);
        console.log(`   天气：${day.avgDesc || (day.hourly[0] ? day.hourly[0].weatherDesc[0].value : '未知')}`);
        console.log(`   降水概率：${day.chanceofrain}%`);
        if (day.hourly && day.hourly[6]) {
          console.log(`   紫外线：${day.hourly[6].uvIndex}`);
        }
      });
      
    } catch (e) {
      console.error('解析错误:', e.message);
      console.log('原始响应:', responseBody.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('请求失败:', e.message);
});
