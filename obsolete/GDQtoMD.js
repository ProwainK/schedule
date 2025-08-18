// const axios = require('axios');
const fs = require('fs');

let gdq_url = 'https://gamesdonequick.com/api/schedule/52';
let gdq_data;
let gdq_rawdata;
let gdq_vod_yt;
let gamedb_rawdata;
let gamedb_data;
let time_today = new Date(0, 0, 0);
let time_day_list = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
let writeStream;

function asioxGetJSON() {

// ES6 原生 Fetch 遠端資料方法
// https://www.casper.tw/javascript/2017/12/28/javascript-fetch/

  fetch(gdq_url, {})
    .then((response) => {
      return response.json(); 
    }).then((gdq_rawdata) => {
      // console.log(gdq_rawdata);
      gdq_data = gdq_rawdata;
      gamedb_rawdata = fs.readFileSync('gamedb-gdq.json');
      gamedb_data = JSON.parse(gamedb_rawdata);
      // Write Start
      writeStream = fs.createWriteStream("AGDQ2025.txt");
      eventInfo();
      // nowInfo();
      console.log(gdq_data.schedule.forEach(myFunction));
      writeStream.end();
      // Write End
    }).catch((err) => {
      console.log('Error:', err);
  });

}

function myFunction(item, index) {

  if (gdq_data.schedule[index].type != "speedrun") {
    return;
  }

  time_scheduled = new Date(gdq_data.schedule[index].starttime);
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

  time_length = gdq_data.schedule[index].run_time.split(':');
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

  //game_runner = gdq_data.schedule[index].runners;
  //game_runner = "test runner";
  game_runner = gdq_data.schedule[index].runners[0].name;

  for (let i = 1; gdq_data.schedule[index].runners[i] != undefined; i++) {
    game_runner = game_runner + ', ' + gdq_data.schedule[index].runners[i].name;
  }


  game_name = gdq_data.schedule[index].name;
  game_rule = gdq_data.schedule[index].category;
  game_type = gdq_data.schedule[index].type;
  game_console = gdq_data.schedule[index].console;
  
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

/*
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
*/

  writeGameName(game_name);

  writeStream.write(' | ' + time_length_parse + '\r\n');

  /*
  writeStream.write('| ' + game_console + ' | ');
  if (game_type != null && game_type != 'single') {
    // 顯示多人競賽、合作等等
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

  if (gdq_data.schedule[index].video_links != null
      && gdq_data.schedule[index].video_links[0] != undefined
      && gdq_data.schedule[index].video_links[0].url != undefined) {
    gdq_vod_yt = gdq_data.schedule[index].video_links;
    //writeStream.write('| [YT](' + gdq_vod_yt[0].url + ') | ');
    writeStream.write('| [YT](' + gdq_data.schedule[index].video_links[0].url + ') | ');
  }
  else {
    writeStream.write('| | ');
  }
  //writeStream.write('| | ');

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
  writeStream.write("title: Awesome Games Done Quick 2025 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("description: GDQ HYPE!!\r\n");
  writeStream.write("---\r\n");
  writeStream.write("\r\n");
  writeStream.write("{%hackmd @ProwainK/HJhBew8KR %}\r\n");
  writeStream.write("\r\n");
  writeStream.write("<style>html, body, .ui-content {background-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3)),\r\n");
  writeStream.write("url(https://gamesdonequick.com/gdqsection.webp);}</style>\r\n");
  writeStream.write("\r\n");
  writeStream.write("# Awesome Games Done Quick 2025 時程表翻譯 ლ(╹◡╹ლ)\r\n");
  writeStream.write("\r\n");
  writeStream.write("## 台灣時間 2025 01/06 00:30 ~ 01/12 (UTC+08:00)\r\n");
  writeStream.write("\r\n");
  writeStream.write("![](https://pbs.twimg.com/media/Gd5ruS2XYAAhy06?format=jpg&name=medium)\r\n");
  writeStream.write("\r\n");
  writeStream.write("# 相關連結\r\n");
  writeStream.write("\r\n");
  writeStream.write("實況頻道：https://www.twitch.tv/gamesdonequick\r\n");
  writeStream.write("日語轉播：https://www.twitch.tv/japanese_restream\r\n");
  writeStream.write("活動資訊：https://gamesdonequick.com/marathons/cm06694cj010zw401cwatx1zo\r\n");
  writeStream.write("官方網站：https://gamesdonequick.com/\r\n");
  writeStream.write("官方時程表：https://gamesdonequick.com/schedule/52\r\n");
  writeStream.write("官方 X (Twitter)：https://x.com/GamesDoneQuick\r\n");
  writeStream.write("跑者投稿：https://submissions.gamesdonequick.com/event/cm0ibg2360005jq0cbokbedsc\r\n");
  writeStream.write("第二輪投稿：https://submissions.gamesdonequick.com/event/cm37o15id0006q5ypnbmfjci5\r\n");
  writeStream.write("抖內項目：https://tracker.gamesdonequick.com/tracker/bids/AGDQ2025\r\n");
  writeStream.write("\r\n");
}

function nowInfo() {
/*
1. 取得現在時間
2. 取得節目的開始時間
3. 逐個比對
4. if 節目的開始時間 > 現在時間，
   現在進行的就是上一個節目
*/
  now_time = new Date();
  now_time = Math.round(now_time.getTime() / 1000);
  //writeStream.write("現在時間：" + now_time + "\r\n");
  //writeStream.write("\r\n");

  gdq_data_length = Object.keys( gdq_data.items ).length;
  for (let i = 0; i < gdq_data_length; i++) {
    if (now_time < gdq_data.items[i].scheduled_t) {
      //writeStream.write(gdq_data.items[i].scheduled_t + "\r\n");
        writeStream.write("| 現正播映 | 稍後節目 |\r\n");
        writeStream.write("| -------- | -------- |\r\n");
        writeStream.write("| ");
        writeGameName(gdq_data.items[i-1].data[0]);
        writeStream.write(" | ");
        writeGameName(gdq_data.items[i].data[0]);
        writeStream.write(" |\r\n");
      break;
    }
  }
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
