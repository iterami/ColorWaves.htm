'use strict';

function recreate_waves(){
    settings_save();

    // Generate and display wave HTML.
    var loop_counter = settings_settings['wave-count'] - 1;
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
    if(settings_settings['orientation'] == 0){
        display = 'block';
        height = '42px';
        width = '100%';
    }
    loop_counter = settings_settings['wave-count'] - 1;
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
          settings_settings['wave-move-interval']
        );
    }
}

function randomize(){
    // Set random wave directions and positions.
    wave_directions = [
      random_boolean()
        ? 1
        : -1,
      random_boolean()
        ? 1
        : -1,
      random_boolean()
        ? 1
        : -1,
    ];
    wave_positions = [
      random_integer({
        'max': settings_settings['wave-count'],
      }),
      random_integer({
        'max': settings_settings['wave-count'],
      }),
      random_integer({
        'max': settings_settings['wave-count'],
      }),
    ];

    update_waves();
}

function update_waves(){
    // Move RGB color generators and change direction on collision with edge.
    var loop_counter = 2;
    do{
        wave_positions[loop_counter] += wave_directions[loop_counter];
        if(wave_positions[loop_counter] > settings_settings['wave-count'] - 1){
            wave_directions[loop_counter] = -1;

        }else if(wave_positions[loop_counter] < 1){
            wave_directions[loop_counter] = 1;
        }
    }while(loop_counter--);

    // Update wave colors colors.
    loop_counter = settings_settings['wave-count'] - 1;
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

window.onload = function(){
    input_init({
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
    });
    settings_init({
      'prefix': 'ColorWaves.htm-',
      'settings': {
        'orientation': 1,
        'wave-count': 10,
        'wave-move-interval': 100,
      },
    });

    document.getElementById('settings').innerHTML =
      '<input onclick=pause(!pause_state) type=button value=Un/[P]ause>'
        + '<input onclick=randomize() type=button value=[R]andomize>'
        + '<select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select>'
        + '<input id=wave-count>'
        + '<input id=wave-move-interval>'
        + '<input onclick=settings_reset();recreate_waves();pause(pause_state) type=button value=Reset>';
    settings_update();

    document.getElementById('orientation').onchange = recreate_waves;
    document.getElementById('wave-count').oninput = recreate_waves;
    document.getElementById('wave-move-interval').oninput = function(e){
        settings_save();
        pause(pause_state);
    };

    recreate_waves();
    randomize();

    pause(false);
};
