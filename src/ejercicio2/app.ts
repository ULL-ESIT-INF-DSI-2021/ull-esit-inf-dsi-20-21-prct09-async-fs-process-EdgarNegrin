import * as fs from 'fs';
import * as yargs from 'yargs';
import {constants} from 'fs';
import {spawn} from 'child_process';


/**
 * Funcion encargada de mostrar la informacion pedida de un fichero
 * utilizando el comando wc sin hacer uso de pipes.
 * @param file ruta del fichero a examinar
 * @param option opciones del escaneo de informacion (l, c, w)
 */
function noPipe(file: string, optionlines: boolean, optionchar: boolean, optionwords: boolean): void {
  fs.access(file, constants.F_OK, (err) => {
    if (err) {
      console.log(`${file} not exist`);
      process.exit(-1);
    } else {
      console.log(`${file} exist`);

      const wc = spawn('wc', [file]);
      let Output = '';

      wc.stdout.on('data', (piece) => (Output += piece));

      wc.on('close', () => {
        const OutputArray = Output.split(/\s+/);
        let result = '';
        if (optionlines) {
          result += `${file} has ${parseInt(OutputArray[1])+1} lines\n`;
        }
        if (optionchar) {
          result += `${file} has ${OutputArray[3]} characters\n`;
        }
        if (optionwords) {
          result += `${file} has ${OutputArray[2]} words\n`;
        }
        console.log(result);
      });
    }
  });
}


/**
 * Funcion encargada de mostrar la informacion pedida de un fichero
 * utilizando el comando wc haciendo uso de pipes.
 * @param file ruta del fichero a examinar
 * @param option opciones del escaneo de informacion (l, c, w)
 */
function pipe(file: string, optionlines: boolean, optionchar: boolean, optionwords: boolean): void {
  fs.access(file, constants.F_OK, (err) => {
    if (err) {
      console.log(`${file} not exist`);
      process.exit(-1);
    } else {
      console.log(`${file} exist`);

      const wc = spawn('wc', [file]);
      let Output = '';

      wc.stdout.on('data', (piece) => (Output += piece));

      wc.on('close', () => {
        const outPutArray = Output.split(/\s+/);
        if (optionlines) {
          const echo = spawn('echo', [`${file} has ${parseInt(outPutArray[1])+1} lines\n`]);
          echo.stdout.pipe(process.stdout);
        }
        if (optionchar) {
          const echo = spawn('echo', [`${file} has ${outPutArray[3]} characters\n`]);
          echo.stdout.pipe(process.stdout);
        }
        if (optionwords) {
          const echo = spawn('echo', [`${file} has ${outPutArray[2]} words\n`]);
          echo.stdout.pipe(process.stdout);
        }
      });
    }
  });
}


/**
 * Comando get que muestra la informacion de un fichero dependiendo del
 * parametro que se le pase como opcion (lineas, palabras, letras).
 * Existe una opcion para usar pipes y otra para no usar pipes.
 */
yargs.command({
  command: 'get',
  describe: 'Information',
  builder: {
    file: {
      describe: 'file',
      demandOption: true,
      type: 'string',
    },
    pipe: {
      describe: 'Use of pipes',
      demandOption: true,
      type: 'boolean',
    },
    optionlines: {
      describe: 'Options command lines',
      demandOption: true,
      type: 'boolean',
    },
    optionchar: {
      describe: 'Options command characters',
      demandOption: true,
      type: 'boolean',
    },
    optionwords: {
      describe: 'Options command words',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.pipe === 'boolean' &&
    typeof argv.optionlines === 'boolean' && typeof argv.optionchar === 'boolean' &&
    typeof argv.optionwords === 'boolean') {
      if (argv.pipe) {
        pipe(argv.file, argv.optionlines, argv.optionchar, argv.optionwords);
      } else {
        noPipe(argv.file, argv.optionlines, argv.optionchar, argv.optionwords);
      }
    }
  },
});


yargs.parse();
