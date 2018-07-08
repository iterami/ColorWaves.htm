'use strict';

function recreate_waves(){
    core_storage_save();

    // Generate and display wave HTML.
    let loop_counter = core_storage_data['wave-count'] - 1;
    let wave_html = '';
    do{
        wave_html += '<div id=' + loop_counter + '></div>';
    }while(loop_counter--);
    document.getElementById('waves').innerHTML = wave_html;

    // Set orientation CSS to vertical by default...
    let display = 'inline-block';
    let height = '420px';
    let width = '42px';
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

    core_interval_modify({
      'id': 'color-waves-interval',
      'interval': core_storage_data['interval'],
      'todo': update_waves,
    });
}

function update_waves(){
    if(core_menu_open){
        return;
    }

    // Move RGB color generators and change direction on collision with edge.
    let loop_counter = 2;
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
    let new_colors = [];
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
