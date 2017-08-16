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
      'info': '<input id=randomize type=button value=Randomize>',
      'storage': {
        'orientation': 1,
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select><td>Orientation<tr><td><input id=wave-count><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    recreate_waves();
    randomize();

    document.getElementById('randomize').onclick = function(){
        randomize();
        core_escape();
    };
    document.getElementById('orientation').onchange = recreate_waves;
    document.getElementById('wave-count').oninput = recreate_waves;

    window.setInterval(
      update_waves,
      core_storage_data['frame-ms']
    );
}

function update_waves(){
    if(core_menu_open){
        return;
    }

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

var wave_directions = [0, 0, 0];
var wave_positions = [0, 0, 0];
