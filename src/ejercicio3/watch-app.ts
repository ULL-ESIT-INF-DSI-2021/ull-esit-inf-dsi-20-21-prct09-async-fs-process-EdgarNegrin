import * as fs from 'fs';
import * as yargs from 'yargs';
import * as chokidar from 'chokidar';
import {constants} from 'fs';

/**
 * Fucion para mostrar los cambios que van surgiendo en la ruta de
 * notas de un usuario
 * @param user usuario
 * @param route ruta donde estan las notas del usuario
 */
function watcher(user: string, route: string) {
  const personalRoute: string = route + '/' + user;
  fs.access(route, constants.F_OK, (err) => {
    if (err) {
      console.log(`${route} not exist`);
      process.exit(-1);
    } else {
      console.log(`${route} exist`);
      fs.access(personalRoute, constants.F_OK, (err) => {
        if (err) {
          console.log(`${user} not exist`);
          process.exit(-1);
        } else {
          console.log(`${user} exist`);
          const watcher = chokidar.watch(personalRoute);

          watcher.on('add', (file) => {
            if ( fs.existsSync(file)) {
              console.log(`${file} has been added!`);
            }
          });

          watcher.on('change', (file) => {
            if ( fs.existsSync(file)) {
              console.log(`${file} has been changed!`);
            }
          });

          watcher.on('unlink', (file) => {
            console.log(`${file} has been deleted!`);
          });
        }
      });
    }
  });
}

/**
 * Comando watch que pide un usuario y la ruta donde estan las notas del usuario
 * para mostrar los cambios que van ocurriendo en las notas del usuario
 */
yargs.command({
  command: 'watch',
  describe: 'Watch the notes',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
      type: 'string',
    },
    route: {
      describe: 'Route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.route === 'string') {
      watcher(argv.user, argv.route);
    }
  },
});


yargs.parse();
