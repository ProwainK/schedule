// const axios = require('axios');
const fs = require('fs');
// const renameDB = require('./renameDB.js');

let event_url = 'https://gamesdonequick.com/api/schedule/62';
let event_data;
let event_rawdata;
let gamedb_rawdata;
let gamedb_data;
let time_today = new Date(0, 0, 0);
let time_day_list = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
let writeStream;

function asioxGetJSON() {

// ES6 原生 Fetch 遠端資料方法
// https://www.casper.tw/javascript/2017/12/28/javascript-fetch/

  fetch(event_url, {})
    .then((response) => {
      return response.json(); 
    }).then((event_rawdata) => {
      // console.log(event_rawdata);
      event_data = event_rawdata;
      gamedb_rawdata = fs.readFileSync('../DB/AGDQ2026-game.json');
      gamedb_data = JSON.parse(gamedb_rawdata);
      // Write Start
      writeStream = fs.createWriteStream("GDQtoMD-SGDQ2026.txt");
      eventInfo();
      // nowInfo();
      console.log(event_data.schedule.forEach(myFunction));
      writeStream.end();
      // Write End
    }).catch((err) => {
      console.log('Error:', err);
  });

}

function myFunction(item, index) {

/*
  time_scheduled = new Date(event_data.items[index].scheduled);
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

  time_length = event_data.items[index].length_t;
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

  game_name = event_data.items[index].data[0];
*/


  if (event_data.schedule[index].type != "speedrun") {
    return;
  }
  if (event_data.schedule[index].name == "The Checkpoint") {
    return;
  }
  if (event_data.schedule[index].name == "Event Recap") {
    return;
  }

  time_scheduled = new Date(event_data.schedule[index].starttime);
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

  time_length = event_data.schedule[index].run_time.split(':');
  time_length_hours = time_length[0];
  time_length_minutes = time_length[1];
  time_length_parse = '';
  if (time_length_hours > 0) {
    time_length_parse = time_length_hours + ' 小時 ';
  }
  if (time_length_minutes > 0) {
    time_length_parse += time_length_minutes + ' 分鐘';
  }
  // console.log(time_length_parse);

  //game_runner = event_data.schedule[index].runners;
  //game_runner = "test runner";
  game_runner = event_data.schedule[index].runners[0].name;

  for (let i = 1; event_data.schedule[index].runners[i] != undefined; i++) {
    game_runner = game_runner + ', ' + event_data.schedule[index].runners[i].name;
  }


  game_name = event_data.schedule[index].name;
  game_rule = event_data.schedule[index].category;
  game_type = event_data.schedule[index].type;
  game_console = event_data.schedule[index].console;


///////////

  //game_rule = event_data.items[index].data[1];
  //game_type = event_data.items[index].data[2];
  //game_console = event_data.items[index].data[3];
  //game_runner = event_data.items[index].data[4];
  
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
    if (gamedb_data[game_name]["AGDQ2026"][game_rule][2] != null) {
      writeStream.write('[VOD](' + gamedb_data[game_name]["AGDQ2026"][game_rule][2] + ') ');
    }
  } catch (error) {
    console.log(error);
  }
  writeStream.write('| ');
  //writeStream.write('| | ');


  // 顯示多人競賽、合作等等
  /*
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
  */


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
  writeStream.write("title: Awesome Games Done Quick 2026 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("description: GDQ HYPE!!\r\n");
  writeStream.write("---\r\n");
  writeStream.write("\r\n");
  writeStream.write("{%hackmd @ProwainK/Bk2lhGxVex %}\r\n");
  writeStream.write("\r\n");
  writeStream.write("# Awesome Games Done Quick 2026 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("\r\n");
  writeStream.write("## 台灣時間 2026 01/05 00:30 ~ 01/11 (UTC+08:00)\r\n");
  writeStream.write("\r\n");
  writeStream.write("![](https://pbs.twimg.com/media/G8A4smBXkAMICnr?format=jpg)\r\n");
  writeStream.write("\r\n");
  writeStream.write("# 相關連結\r\n");
  writeStream.write("\r\n");
  writeStream.write("實況頻道：https://www.twitch.tv/gamesdonequick  \r\n");
  writeStream.write("日語轉播：https://www.twitch.tv/japanese_restream  \r\n");
  writeStream.write("活動資訊：https://gamesdonequick.com  \r\n");
  writeStream.write("跑者投稿：https://submissions.gamesdonequick.com/  \r\n");
  writeStream.write("抖內項目：https://tracker.gamesdonequick.com/tracker/event/AGDQ2026  \r\n");
  writeStream.write("Yetee 週邊商品：https://theyetee.com  \r\n");
  writeStream.write("Speedrun VOD Club：https://vods.speedrun.club/  \r\n");
  writeStream.write("官方推特 (X)：https://x.com/GamesDoneQuick  \r\n");
  writeStream.write("官方時程表：https://gamesdonequick.com/schedule/62  \r\n");
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
