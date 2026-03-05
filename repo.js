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
      core_random_integer(core_storage_data.count),
      core_random_integer(core_storage_data.count),
      core_random_integer(core_storage_data.count),
    ];

    update_waves();

    core_interval_modify({
      'id': 'interval',
      'interval': core_storage_data.interval,
      'todo': update_waves,
    });
}

function remake_waves(){
    core_elements.waves.style.whiteSpace = core_storage_data.wrap
      ? ''
      : 'nowrap';

    let wave_html = '';
    for(let i = 0; i < core_storage_data.count; i++){
        wave_html += '<div id=' + i + '></div>';
    }
    core_elements.waves.innerHTML = wave_html;

    let display = 'inline-block';
    let height = core_storage_data.vertical_height;
    let width = core_storage_data.vertical_width;
    if(core_storage_data.orientation === 0){
        display = 'block';
        height = core_storage_data.horizontal_height;
        width = core_storage_data.horizontal_width;
    }

    for(const element in core_elements){
        if(!globalThis.isNaN(element)){
            delete core_elements[element];
        }
    }
    for(let i = 0; i < core_storage_data.count; i++){
        core_elements[i] = document.getElementById(i);
        const style = core_elements[i].style;
        style.display = display;
        style.height = height;
        style.width = width;
    }

    randomize();
}

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': function(){
              randomize();
              core_escape();
          },
        },
        'remake': {
          'onclick': function(){
              remake_waves();
              core_escape();
          },
        },
      },
      'globals': {
        'wave_directions': [0, 0, 0],
        'wave_positions': [0, 0, 0],
      },
      'info': '<button class=medium id=randomize type=button>Randomize</button><button class=medium id=remake type=button>Remake</button>',
      'storage': {
        'count': 20,
        'distance': 9,
        'horizontal_height': '42px',
        'horizontal_width': '100%',
        'interval': 100,
        'orientation': 1,
        'vertical_height': '420px',
        'vertical_width': '5%',
        'wrap': false,
      },
      'storage_menu': '<table><tr><td><input class=mini id=distance max=15 min=1 step=any type=number><td>Distance 1-15'
        + '<tr><td><input class=mini id=horizontal_height type=text><td>Horizontal Height'
        + '<tr><td><input class=mini id=horizontal_width type=text><td>Horizontal Width'
        + '<tr><td><input class=mini id=interval min=1 step=any type=number><td>Interval'
        + '<tr><td><select id=orientation><option value=0>Horizontal<option value=1>Vertical</select><td>Orientation'
        + '<tr><td><input class=mini id=vertical_height type=text><td>Vertical Height'
        + '<tr><td><input class=mini id=vertical_width type=text><td>Vertical Width'
        + '<tr><td><input class=mini id=count min=1 step=1 type=number><td>Wave Count'
        + '<tr><td class=right><input id=wrap type=checkbox><td><label for=wrap>Wrap</label></table>',
      'title': 'ColorWaves.htm',
      'ui_elements': [
        'waves',
      ],
    });

    remake_waves();
    randomize();
}

function update_waves(){
    for(let i = 0; i < 3; i++){
        wave_positions[i] += wave_directions[i];
        if(wave_positions[i] > core_storage_data.count - 1){
            wave_directions[i] = -1;

        }else if(wave_positions[i] < 1){
            wave_directions[i] = 1;
        }
    }

    const distance = Math.max(
      Math.min(
        core_storage_data.distance,
        15
      ),
      1
    );
    for(let i = 0; i < core_storage_data.count; i++){
        const new_colors = [
          Math.max(
            distance - Math.abs(wave_positions[0] - i),
            0
          ).toString(16),
          Math.max(
            distance - Math.abs(wave_positions[1] - i),
            0
          ).toString(16),
          Math.max(
            distance - Math.abs(wave_positions[2] - i),
            0
          ).toString(16),
        ];

        core_elements[i].style.backgroundColor = '#' + new_colors[0] + new_colors[1] + new_colors[2];
    }
}
