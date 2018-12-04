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
        'recreate': {
          'onclick': function(){
              core_escape();
              recreate_waves();
          },
        },
      },
      'globals': {
        'wave_directions': [0, 0, 0],
        'wave_positions': [0, 0, 0],
      },
      'info': '<input id=randomize type=button value=Randomize><input id=recreate type=button value=Recreate>',
      'storage': {
        'horizontal-height': '42px',
        'horizontal-width': '100%',
        'interval': 100,
        'orientation': 1,
        'vertical-height': '420px',
        'vertical-width': '42px',
        'wave-count': 20,
      },
      'storage-menu': '<table><tr><td><input id=horizontal-height><td>Horizontal Height<tr><td><input id=horizontal-width><td>Horizontal Width<tr><td><input id=interval><td>Interval<tr><td><select id=orientation><option value=0>Horizontal</option><option value=1>Vertical</option></select><td>Orientation<tr><td><input id=vertical-height><td>Vertical Height<tr><td><input id=vertical-width><td>Vertical Width<tr><td><input id=wave-count><td>Wave Count</table>',
      'title': 'ColorWaves.htm',
    });

    recreate_waves();
    randomize();
}
