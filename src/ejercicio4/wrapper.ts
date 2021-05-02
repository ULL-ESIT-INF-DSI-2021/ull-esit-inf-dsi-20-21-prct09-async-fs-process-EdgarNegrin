import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as yargs from 'yargs';
import * as rimraf from 'rimraf';


/**
 * Comando type para mostrar si una ruta es un directorio
 * o un fichero
 */
yargs.command({
  command: 'type',
  describe: 'show if a route is a file or a directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.lstat(`${argv.path}`, (err, stats) => {
        if (err) {
          console.log('Path not exist');
        } else {
          if (stats.isFile()) {
            console.log(`${argv.path} is a File`);
          } else {
            console.log(`${argv.path} is a Directory`);
          }
        }
      });
    }
  },
});


/**
 * Comando mkdir para crear un directorio a partir de una ruta
 */
yargs.command({
  command: 'mkdir',
  describe: 'add a directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.mkdir(`${argv.path}`, {recursive: true}, (err) => {
        if (err) console.log('Error with the add');
      });
    }
  },
});


/**
 * Comando list para listar ficheros dentro de un directorio
 */
yargs.command({
  command: 'list',
  describe: 'list files of a directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.readdir(`${argv.path}`, (err, files) => {
        if (err) {
          console.log(`${argv.path} not exit`);
        } else {
          console.log(`${argv.path}: `);
          files.forEach((file) => {
            console.log(file);
          });
        }
      });
    }
  },
});


/**
 * Comando cat para mostrar fichero
 */
yargs.command({
  command: 'cat',
  describe: 'Show a file',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.readFile(`${argv.path}`, (err, data) => {
        if (err) {
          console.log(`Cant show the file`);
        } else {
          console.log(data.toString());
        }
      });
    }
  },
});


/**
 * Comando rm para eliminar un directorio o fichero
 */
yargs.command({
  command: 'rm',
  describe: 'Delete a file or directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.lstat(`${argv.path}`, (err, stats) => {
        if (err) {
          console.log('Path not exit');
        } else {
          if (stats.isFile()) {
            fs.rm(`${argv.path}`, (err) => {
              if (err) {
                console.log(`Cant delete the file`);
              } else {
                console.log(`File ${argv.path} deleted`);
              }
            });
          } else {
            rimraf(`${argv.path}`, (err) => {
              if (err) {
                console.log(`Cant delete the directory`);
              } else {
                console.log(`Directory ${argv.path} deleted`);
              }
            });
          }
        }
      });
    }
  },
});


/**
 * Comando mv para mover un direcorio o un fichero
 */
yargs.command({
  command: 'mv',
  describe: 'Move a file or a ditectory to another newpath',
  builder: {
    Path: {
      describe: 'Path origin',
      demandOption: true,
      type: 'string',
    },
    newPath: {
      describe: 'Path destination',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.Path === 'string' && typeof argv.newPath === 'string') {
      fsExtra.move(`${argv.Path}`, `${argv.newPath}`, (err) => {
        if (err) {
          console.log('Cant move');
        } else {
          console.log('Move success!');
        }
      });
    }
  },
});

/**
 * Comando cp para copiar un directorio o un fichero a una nueva ruta
 */
yargs.command({
  command: 'cp',
  describe: 'Copy a file or a directory to another path',
  builder: {
    Path: {
      describe: 'path origin',
      demandOption: true,
      type: 'string',
    },
    newPath: {
      describe: 'path destination',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.Path === 'string' && typeof argv.newPath === 'string') {
      fsExtra.copy(`${argv.Path}`, `${argv.newPath}`, (err) => {
        if (err) {
          console.log('Cant copy');
        } else {
          console.log('Copy Success!');
        }
      });
    }
  },
});


yargs.parse();
