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
    let height = core_storage_data['vertical-height'];
    let width = core_storage_data['vertical-width'];
    // ...or horizontal, if selected.
    if(core_storage_data['orientation'] === 0){
        display = 'block';
        height = core_storage_data['horizontal-height'];
        width = core_storage_data['horizontal-width'];
    }
    loop_counter = core_storage_data['wave-count'] - 1;
    do{
        const element = document.getElementById(loop_counter);

        element.style.display = display;
        element.style.height = height;
        element.style.width = width;
    }while(loop_counter--);

    randomize();
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

    let distance = Math.max(
      Math.min(
        core_storage_data['distance'],
        15
      ),
      1
    );

    // Update wave colors.
    loop_counter = core_storage_data['wave-count'] - 1;
    do{
        // Color is based on distance from generator.
        let new_colors = [
          Math.max(
            distance - Math.abs(loop_counter - wave_positions[0]),
            0
          ).toString(16),
          Math.max(
            distance - Math.abs(loop_counter - wave_positions[1]),
            0
          ).toString(16),
          Math.max(
            distance - Math.abs(loop_counter - wave_positions[2]),
            0
          ).toString(16),
        ];

        document.getElementById(loop_counter).style.backgroundColor =
          '#' + new_colors[0] + new_colors[1] + new_colors[2];
    }while(loop_counter--);
}
