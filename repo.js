'use strict';

function randomize(){
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

function remake_waves(){
    let loop_counter = core_storage_data['wave-count'] - 1;
    let wave_html = '';
    do{
        wave_html += '<div id=' + loop_counter + '></div>';
    }while(loop_counter--);
    document.getElementById('waves').innerHTML = wave_html;

    let display = 'inline-block';
    let height = core_storage_data['vertical-height'];
    let width = core_storage_data['vertical-width'];
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

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': core_repo_reset,
        },
        'remake': {
          'onclick': function(){
              core_escape();
              remake_waves();
          },
        },
      },
      'globals': {
        'wave_directions': [0, 0, 0],
        'wave_positions': [0, 0, 0],
      },
      'info': '<button id=randomize type=button>Randomize</button><button id=remake type=button>Remake</button>',
      'reset': function(){
          if(core_menu_open){
              core_escape();
          }
          randomize();
      },
      'storage': {
        'distance': 9,
        'horizontal-height': '42px',
        'horizontal-width': '100%',
        'interval': 100,
        'orientation': 1,
        'vertical-height': '420px',
        'vertical-width': '42px',
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><input class=mini id=distance max=15 min=1 step=any type=number><td>Distance 1-15'
        + '<tr><td><input class=mini id=horizontal-height type=text><td>Horizontal Height'
        + '<tr><td><input class=mini id=horizontal-width type=text><td>Horizontal Width'
        + '<tr><td><input class=mini id=interval min=1 step=any type=number><td>Interval'
        + '<tr><td><select id=orientation><option value=0>Horizontal<option value=1>Vertical</select><td>Orientation'
        + '<tr><td><input class=mini id=vertical-height type=text><td>Vertical Height'
        + '<tr><td><input class=mini id=vertical-width type=text><td>Vertical Width'
        + '<tr><td><input class=mini id=wave-count min=1 step=any type=number><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    remake_waves();
    randomize();
}

function update_waves(){
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

    loop_counter = core_storage_data['wave-count'] - 1;
    do{
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
