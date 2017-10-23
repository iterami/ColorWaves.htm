'use strict';

function repo_init(){
    core_repo_init({
      'globals': {
        'wave_directions': [0, 0, 0],
        'wave_positions': [0, 0, 0],
      },
      'info': '<input id=randomize type=button value=Randomize>',
      'info-events': {
        'randomize': {
          'todo': function(){
              randomize();
              core_escape();
          },
        },
      },
      'storage': {
        'orientation': 1,
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select><td>Orientation<tr><td><input id=wave-count><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    recreate_waves();
    randomize();

    window.setInterval(
      update_waves,
      core_storage_data['frame-ms']
    );
}
