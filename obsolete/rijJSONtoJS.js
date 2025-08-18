const fs = require('fs');

const EVENT_ID = 56;
const gdq_url = `https://horaro.org/-/api/v1/events/rtaij/schedules/rtaijs2025`;

fetch(gdq_url, {})
  .then((response) => {
    return response.json(); 
  }).then((gdq_rawdata) => {
    console.log(gdq_rawdata);
    const jsonString = JSON.stringify(gdq_rawdata, null, 2); // 美化輸出
    const jsContent = `window.eventLocalSchedule = ${jsonString};\n`;
    fs.writeFileSync("rijs2025.js", jsContent, 'utf-8');
  }).catch((err) => {
    console.log('Error: ', err);
  });
