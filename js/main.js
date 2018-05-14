'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': function(){
              core_escape();
              randomize();
          },
        },
      },
      'globals': {
        'wave_directions': [0, 0, 0],
        'wave_positions': [0, 0, 0],
      },
      'info': '<input id=randomize type=button value=Randomize>',
      'storage': {
        'interval': 100,
        'orientation': 1,
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><input id=interval><td>Interval<tr><td><select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select><td>Orientation<tr><td><input id=wave-count><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    recreate_waves();
    randomize();
}
