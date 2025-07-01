const fs = require('fs');

fs.readFile('gameDB.json', 'utf-8', (err, gamedb_rawdata) => {
  if (err) {
    console.error('Error: ', err);
    return;
  }
    const gamedb_data = JSON.parse(gamedb_rawdata);
    console.log(gamedb_data);
    const jsonString = JSON.stringify(gamedb_data, null, 2);
    const jsContent = `window.gameDB = ${jsonString};\n`;
    fs.writeFileSync("gameDB.js", jsContent, 'utf-8');
});


