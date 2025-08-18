const fs = require('fs');

let rawdata = fs.readFileSync('rtaijw2023.json');
let esa_data = JSON.parse(rawdata);

// console.log(esa_data.schedule.items[0]);

time_today = new Date(0, 0, 0);
time_day_list = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

function myFunction(item, index) {

  time_scheduled = new Date(esa_data.schedule.items[index].scheduled);
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

  time_length = esa_data.schedule.items[index].length_t;
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

  /*game_name = esa_data.schedule.items[index].data[0];
  game_runner = esa_data.schedule.items[index].data[1];
  game_console = esa_data.schedule.items[index].data[2];
  game_rule = esa_data.schedule.items[index].data[3];
  game_type = esa_data.schedule.items[index].data[4];*/

  game_name = esa_data.schedule.items[index].data[0];
  game_rule = esa_data.schedule.items[index].data[1];
  game_console = esa_data.schedule.items[index].data[2];
  game_type = esa_data.schedule.items[index].data[3];
  game_runner = esa_data.schedule.items[index].data[5];
  

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

  writeStream.write('| ' + time_scheduled_parse + ' | **' + game_name + '** | ' + time_length_parse + '\r\n');
  writeStream.write('| ' + game_console + ' | ');
  if (game_type != null) {
    writeStream.write('【' + game_type + '】');
  }
  writeStream.write(game_rule + ' | ' + game_runner + '\r\n');
}

var writeStream = fs.createWriteStream("test.txt");
console.log(esa_data.schedule.items.forEach(myFunction));
writeStream.end();
