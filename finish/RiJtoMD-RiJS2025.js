// const axios = require('axios');
const fs = require('fs');
const renameDB = require('./renameDB.js');

let rij_url = 'https://horaro.org/-/api/v1/events/rtaij/schedules/rtaijs2025';
let rij_data;
let rij_rawdata;
let gamedb_rawdata;
let gamedb_data;
let time_today = new Date(0, 0, 0);
let time_day_list = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
let writeStream;

function asioxGetJSON() {

// ES6 原生 Fetch 遠端資料方法
// https://www.casper.tw/javascript/2017/12/28/javascript-fetch/

  fetch(rij_url, {})
    .then((response) => {
      return response.json(); 
    }).then((rij_rawdata) => {
      // console.log(rij_rawdata);
      rij_data = rij_rawdata.data;
      gamedb_rawdata = fs.readFileSync('gameDB.json');
      gamedb_data = JSON.parse(gamedb_rawdata);
      // Write Start
      writeStream = fs.createWriteStream("RiJS2025.txt");
      eventInfo();
      // nowInfo();
      console.log(rij_data.items.forEach(myFunction));
      writeStream.end();
      // Write End
    }).catch((err) => {
      console.log('Error:', err);
  });

}

function myFunction(item, index) {

  time_scheduled = new Date(rij_data.items[index].scheduled);
  time_scheduled_hours = time_scheduled.getHours();
  time_scheduled_minutes = time_scheduled.getMinutes();
  time_scheduled_parse = '';
  if (time_scheduled_hours < 10) {
    time_scheduled_parse += '0';
  }
  time_scheduled_parse += time_scheduled_hours + ':';
  if (time_scheduled_minutes < 10) {
    time_scheduled_parse += '0';
  }
  time_scheduled_parse += time_scheduled_minutes;
  // console.log(time_scheduled_parse);

  time_length = rij_data.items[index].length_t;
  time_length_hours = Math.floor(time_length / 3600);
  time_length_minutes = Math.floor((time_length / 60) % 60);
  time_length_parse = '';
  if (time_length_hours > 0) {
    time_length_parse = time_length_hours + ' 小時 ';
  }
  if (time_length_minutes > 0) {
    time_length_parse += time_length_minutes + ' 分鐘';
  }
  // console.log(time_length_parse);

  game_name = rij_data.items[index].data[0];
  try {
    game_name = renameDB[game_name] || game_name; // Rename
  } catch (error) {
    console.log(error);
  }
  game_rule = rij_data.items[index].data[1];
  game_type = rij_data.items[index].data[2];
  game_console = rij_data.items[index].data[3];
  game_runner = rij_data.items[index].data[4];
  
  console.log(' | ' + time_scheduled_parse + ' | ' + game_name + ' | ' + time_length_parse);
  console.log(' | ' + game_console + ' | ' + game_rule + ' | ' + game_runner);

  time_today_twdate = new Date(time_today.toLocaleDateString('zh-TW'));
  time_scheduled_twdate = new Date(time_scheduled.toLocaleDateString('zh-TW'));
  if (time_today_twdate.getTime() < time_scheduled_twdate.getTime()) {
  //if (time_today.toLocaleDateString('zh-TW') < time_scheduled.toLocaleDateString('zh-TW')) {
    time_today = time_scheduled;
    time_today_month = time_today.toLocaleString("default", { month: "2-digit" }).slice(0, 2);
    time_today_date = time_today.toLocaleString("default", { day: "2-digit" }).slice(0, 2);
    time_today_day = time_today.getDay();
    time_today_parse = time_today_month + '/' + time_today_date + ' ' + time_day_list[time_today_day];
    writeStream.write('\r\n# ' + time_today_parse + '\r\n\r\n');
    writeStream.write('| 預定開跑 | 遊戲名稱・挑戰項目 | 預計用時・跑者 |\r\n');
    writeStream.write('|:--------:|:------------------:|:--------------:|\r\n');
    console.log(time_today);
  }

  // writeStream.write('| ' + time_scheduled_parse + ' | **' + game_name + '** | ' + time_length_parse + '\r\n');
  writeStream.write('| ' + time_scheduled_parse + ' | ');

  writeGameName(game_name);

  writeStream.write(' | ' + time_length_parse + '\r\n');

  // VOD 連結
  writeStream.write('| ');
  try {
    if (gamedb_data[game_name]["rijs2025"][game_rule][2] != null) {
      writeStream.write('[VOD](' + gamedb_data[game_name]["rijs2025"][game_rule][2] + ') ');
    }
  } catch (error) {
    console.log(error);
  }
  writeStream.write('| ');
  //writeStream.write('| | ');


  // 顯示多人競賽、合作等等
  if (game_type != null && game_type != 'single') {
    // writeStream.write('【' + game_type + '】');
    game_type_temp = '單人';
    if (game_type == 'race') {
      game_type_temp = '競賽';
    }
    if (game_type == 'relay') {
      game_type_temp = '接力';
    }
    if (game_type == 'coop') {
      game_type_temp = '合作';
    }
    writeStream.write('【' + game_type_temp + '】');
  }


  //writeStream.write(game_rule + '<br>');
  writeStream.write(game_rule);
  if (game_console != "") {
    writeStream.write(' (' + game_console + ')');
  }
  writeStream.write('<br>');

  if (gamedb_data[game_name] && gamedb_data[game_name][game_rule] != undefined) {
    writeStream.write('<span style="color:LightCoral">' + gamedb_data[game_name][game_rule] + '</span>');
  }
  writeStream.write(' | ');

  if (game_runner == null) {}
  else if (game_runner.includes(',')) {
    writeStream.write('<details>' + game_runner + '</details>');
  }
  else  {
    writeStream.write(game_runner);
  }

  writeStream.write('\r\n');
  writeStream.write('| | |\r\n');
  //writeStream.write('| | |\r\n');
}

function eventInfo() {
  writeStream.write("---\r\n");
  writeStream.write("title: RTA in Japan Summer 2025 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("description: 無敵時間さん！？\r\n");
  writeStream.write("---\r\n");
  writeStream.write("\r\n");
  writeStream.write("{%hackmd @ProwainK/HJhBew8KR %}\r\n");
  writeStream.write("\r\n");
  writeStream.write("# RTA in Japan Summer 2025 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("\r\n");
  writeStream.write("## 台灣時間 2025 08/09 14:00 ~ 08/15 (UTC+08:00)\r\n");
  writeStream.write("\r\n");
  writeStream.write("![](https://rtain.jp/wp-content/uploads/2024/12/s2025-announce.jpg)\r\n");
  writeStream.write("\r\n");
  writeStream.write("# 相關連結\r\n");
  writeStream.write("\r\n");
  writeStream.write("實況頻道：https://www.twitch.tv/rtainjapan\r\n");
  writeStream.write("英語轉播：https://www.twitch.tv/englishrestream\r\n");
  writeStream.write("活動頁面：https://rtain.jp/rtaij/rta-in-japan-summer-2025\r\n");
  writeStream.write("跑者投稿：https://t.co/a8RulAOWKy\r\n");
  writeStream.write("抖內項目：https://tracker.rtain.jp/bids/rtaijs2025\r\n");
  writeStream.write("官方推特 (X)：https://x.com/rtainjapan\r\n");
  writeStream.write("官方時程表：https://horaro.org/rtaij/rtaijs2025\r\n");
  writeStream.write("\r\n");
}

function writeGameName(game_name) {
  if (gamedb_data[game_name] != undefined) {

    let gamenamehighlight = false;
    writeStream.write('**');

    if (gamedb_data[game_name].tw != undefined) {
      // console.log(gamedb_data[game_name].tw);
      writeStream.write(gamedb_data[game_name].tw);
      if (gamenamehighlight == false) {
        writeStream.write('**');
        gamenamehighlight = true;
      }
      writeStream.write('<br>');
    }
    if (gamedb_data[game_name].jp != undefined) {
      // console.log(gamedb_data[game_name].jp);
      writeStream.write(gamedb_data[game_name].jp);
      if (gamenamehighlight == false) {
        writeStream.write('**');
        gamenamehighlight = true;
      }
      writeStream.write('<br>');
    }
    if (gamedb_data[game_name].en != undefined) {
      // console.log(gamedb_data[game_name].en);
      writeStream.write(gamedb_data[game_name].en);
      if (gamenamehighlight == false) {
        writeStream.write('**');
        gamenamehighlight = true;
      }
    }

  }
  else {
    // 資料庫裡面沒找到 (新增資料還沒填 or 有漏掉)
    // 用斜體 + 粗體顯示
    writeStream.write('***' + game_name + '***');
  }
}

// Main (Start)
asioxGetJSON();
// Main (End)
