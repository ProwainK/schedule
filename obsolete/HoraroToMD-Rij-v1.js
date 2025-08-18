const fs = require('fs');

let rawdata = fs.readFileSync('rtaij-rtaijw2023.json');
let rij_data = JSON.parse(rawdata);

let gamedb_rawdata = fs.readFileSync('gamedb.json');
let gamedb_data = JSON.parse(gamedb_rawdata);

// console.log(rij_data.schedule.items[0]);

time_today = new Date(0, 0, 0);
time_day_list = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

function eventInfo() {
writeStream.write("---\r\n");
writeStream.write("title: RTA in Japan Winter 2023 時程表翻譯 ლ(╹◡╹ლ)\r\n");
writeStream.write("description: 無敵時間さん！？\r\n");
writeStream.write("---\r\n");
writeStream.write("\r\n");
writeStream.write("# RTA in Japan Winter 2023 時程表翻譯 ლ(╹◡╹ლ)\r\n");
writeStream.write("\r\n");
writeStream.write("## 台灣時間 2023 12/26 11:00 ~ 12/31 (UTC+08:00)\r\n");
writeStream.write("\r\n");
writeStream.write("\r\n");
writeStream.write("------\r\n");
writeStream.write("\r\n");
writeStream.write("# 相關連結\r\n");
writeStream.write("\r\n");
writeStream.write("Twitch 主頻道：https://www.twitch.tv/rtainjapan\r\n");
writeStream.write("活動資訊：https://rtain.jp/rtaij/rta-in-japan-winter-2023\r\n");
writeStream.write("官方網站：https://rtain.jp\r\n");
writeStream.write("官方時程表 (Horaro)：https://horaro.org/rtaij/rtaijw2023\r\n");
writeStream.write("官方 Twitter：https://twitter.com/rtainjapan\r\n");
writeStream.write("跑者投稿：https://oengus.io/marathon/rtaijw2023/submissions\r\n");
writeStream.write("\r\n");
writeStream.write("\r\n");
writeStream.write("------\r\n");
}

function myFunction(item, index) {

  time_scheduled = new Date(rij_data.schedule.items[index].scheduled);
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

  time_length = rij_data.schedule.items[index].length_t;
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

  game_name = rij_data.schedule.items[index].data[0];
  game_rule = rij_data.schedule.items[index].data[1];
  game_console = rij_data.schedule.items[index].data[2];
  game_type = rij_data.schedule.items[index].data[3];
  game_runner = rij_data.schedule.items[index].data[5];
  
  console.log(' | ' + time_scheduled_parse + ' | ' + game_name + ' | ' + time_length_parse);
  console.log(' | ' + game_console + ' | ' + game_rule + ' | ' + game_runner);

  if (time_today.toLocaleDateString('zh-TW') < time_scheduled.toLocaleDateString('zh-TW')) {
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

  writeStream.write(' | ' + time_length_parse + '\r\n');

  writeStream.write('| ' + game_console + ' | ');
  if (game_type != null && game_type != 'Single run') {
    writeStream.write('【' + game_type + '】');
  }
  writeStream.write(game_rule + ' | ');

  // writeStream.write(game_runner);
  if (game_type != 'Single run') {
    writeStream.write('<details>' + game_runner + '</details>');
  }
  else {
    writeStream.write(game_runner);
  }

  writeStream.write('\r\n');
  writeStream.write('| | |\r\n');
  writeStream.write('| | |\r\n');
}

// Main (Start)
var writeStream = fs.createWriteStream("test.txt");
eventInfo();
console.log(rij_data.schedule.items.forEach(myFunction));
writeStream.end();
// Main (End)

