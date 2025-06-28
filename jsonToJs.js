const fs = require('fs');

const EVENT_ID = 56;
const gdq_url = `https://tracker.gamesdonequick.com/tracker/api/v2/events/${EVENT_ID}/runs`;

fetch(gdq_url, {})
  .then((response) => {
    return response.json(); 
  }).then((gdq_rawdata) => {
    console.log(gdq_rawdata);
    const jsonString = JSON.stringify(gdq_rawdata, null, 2); // 美化輸出
    const jsContent = `window.gdqLocalSchedule = ${jsonString};\n`;
    fs.writeFileSync("sgdq2025.js", jsContent, 'utf-8');
  }).catch((err) => {
    console.log('Error: ', err);
  });

fs.readFile('gameDB.json', 'utf-8', (err, gamedb_rawdata) => {
  if (err) {
    console.error('Error: ', err);
    return;
  }
    const gamedb_data = JSON.parse(gamedb_rawdata);
  //console.log(jsonData);
    console.log(gamedb_data);
    const jsonString = JSON.stringify(gamedb_data, null, 2);
    const jsContent = `window.gameDB = ${jsonString};\n`;
    fs.writeFileSync("gameDB.js", jsContent, 'utf-8');
});


