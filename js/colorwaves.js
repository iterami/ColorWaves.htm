'use strict';

function recreate_waves(){
    core_storage_save();

    // Generate and display wave HTML.
    var loop_counter = core_storage_data['wave-count'] - 1;
    var wave_html = '';
    do{
        wave_html += '<div id=' + loop_counter + '></div>';
    }while(loop_counter--);
    document.getElementById('waves').innerHTML = wave_html;

    // Set orientation CSS to vertical by default...
    var display = 'inline-block';
    var height = '420px';
    var width = '42px';
    // ...or horizontal, if selected.
    if(core_storage_data['orientation'] == 0){
        display = 'block';
        height = '42px';
        width = '100%';
    }
    loop_counter = core_storage_data['wave-count'] - 1;
    do{
        document.getElementById(loop_counter).style.display = display;
        document.getElementById(loop_counter).style.height = height;
        document.getElementById(loop_counter).style.width = width;
    }while(loop_counter--);

    // Update waves.
    update_waves();
}

function pause(new_pause_state){
    window.clearInterval(timer);

    pause_state = new_pause_state;
    // If unpaused, update waves periodically.
    if(!pause_state){
        timer = window.setInterval(
          update_waves,
          core_storage_data['frame-ms']
        );
    }
}

function randomize(){
    // Set random wave directions and positions.
    wave_directions = [
      core_random_boolean()
        ? 1
        : -1,
      core_random_boolean()
        ? 1
        : -1,
      core_random_boolean()
        ? 1
        : -1,
    ];
    wave_positions = [
      core_random_integer({
        'max': core_storage_data['wave-count'],
      }),
      core_random_integer({
        'max': core_storage_data['wave-count'],
      }),
      core_random_integer({
        'max': core_storage_data['wave-count'],
      }),
    ];

    update_waves();
}

function repo_init(){
    core_repo_init({
      'keybinds': {
        80: {
          'todo': function(){
              pause(!pause_state);
          },
        },
        82: {
          'todo': randomize,
        },
      },
      'storage': {
        'orientation': 1,
        'wave-count': 20,
      },
      'storage-menu': '<select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select>Orientation<br><input id=wave-count>Wave Count',
      'title': 'ColorWaves.htm',
    });

    document.getElementById('controls').innerHTML = '<input onclick=pause(!pause_state) type=button value=Un/[P]ause><input onclick=randomize() type=button value=[R]andomize>';

    document.getElementById('orientation').onchange = recreate_waves;
    document.getElementById('wave-count').oninput = recreate_waves;

    recreate_waves();
    randomize();

    pause(false);
}

function update_waves(){
    // Move RGB color generators and change direction on collision with edge.
    var loop_counter = 2;
    do{
        wave_positions[loop_counter] += wave_directions[loop_counter];
        if(wave_positions[loop_counter] > core_storage_data['wave-count'] - 1){
            wave_directions[loop_counter] = -1;

        }else if(wave_positions[loop_counter] < 1){
            wave_directions[loop_counter] = 1;
        }
    }while(loop_counter--);

    // Update wave colors colors.
    loop_counter = core_storage_data['wave-count'] - 1;
    var new_colors = [];
    do{
        // Color is based on distance from generator.
        new_colors = [
          9 - Math.abs(loop_counter - wave_positions[0]),
          9 - Math.abs(loop_counter - wave_positions[1]),
          9 - Math.abs(loop_counter - wave_positions[2]),
        ];

        // Set color CSS and prevent negative values.
        document.getElementById(loop_counter).style.backgroundColor =
          '#'
          + (new_colors[0] > 0
            ? new_colors[0]
            : 0
          )
          + (new_colors[1] > 0
            ? new_colors[1]
            : 0
          )
          + (new_colors[2] > 0
            ? new_colors[2]
            : 0
          );
    }while(loop_counter--);
}

var pause_state = false;
var timer = 0;
var wave_directions = [0, 0, 0];
var wave_positions = [0, 0, 0];
