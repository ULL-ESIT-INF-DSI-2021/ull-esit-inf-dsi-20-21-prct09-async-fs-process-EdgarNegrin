## Calidad y seguridad del código fuente mediante Sonar Cloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-EdgarNegrin&metric=alert_status)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-EdgarNegrin)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-EdgarNegrin/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-EdgarNegrin/actions/workflows/tests.yml)


# Introducción

En esta practica seguiremos utilizando el lenguaje TypeScript para hacer uso de las diferentes APIs de callbacks que tiene Node.js disponibles para interactuar con el sistema de ficheros y la API asincrona para crear procesos.

# Objetivos

Los principales objetivos de esta practica son:

* Manejo del módulo **yargs** para implementar por linea de comandos.
* Manejo de las APIs de **callbacks** y **asincrona** proporcionadas por Node.js para trabajar con el sistema de ficheros.

# Creación de la estructura

Se ha comenzado la práctica creando la estructura del proyecto como se ha aprendido en las practicas anteriores. Siguiento el tutorial que se nos ha proporcionado. El ejercicio se ha realizado dentro del directorio src/, donde cada ejercicio tendrá su propio directorio. Se han activado las github Actions para mantener un control del código.

No se han realizado tests ya que se esta haciendo uso de *yargs* para interactuar a través de la linea de comandos.

# Ejercicio 1

## Funcionalidad

Considerando el ejemplo de código fuente que se nos ha proporcionado para realizar una traza de ejecución del programa, mostrando el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores de Node.js, además de lo que muestra la consola.

## Codigo

```
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Vamos a tener en cuenta que se realizan dos modificaciones del fichero helloworld.txt a lo largo de la ejecucion.

* Caso 1: No se le pasa un nombre de fichero

Se comprueba que el nombre del fichero no es mayor que 3 en *if (process.argv.length !== 3)* ya que no se le esta pasando el argumento.

```
Pila de llamadas: annonymus()
Registro de eventos: -
Cola: -
Consola: Please, specify a file
```

* Caso 2: Se le pasa un nombre de fichero valido

En este caso estamos especificando el argumento, por lo que se continuará con la ejecución del programa colocando el metodo *access* en la pila de llamadas. 

```
Pila de llamadas: err => {} || access()
Registro de eventos: -
Cola: -
Consola: -
```

Seguidamente se coloca en el registro de eventos por ser un metodo asincrono.

```
Pila de llamadas: -
Registro de eventos: err => {}
Cola: -
Consola: -
```

En el momento en el que *access* compruebe si existe el fichero se manda a la cola.

```
Pila de llamadas: -
Registro de eventos: -
Cola: err => {}
Consola: -
```

Se introducen y ejecutan los procesos de la cola en la pila de llamadas.

En caso de hacer un error:

```
Pila de llamadas: err => {.....}
Registro de eventos: -
Cola: -
Consola: File ${filename} does not exist
```

En caso de que no ocurra ningun error:

```
Pila de llamadas: err => {.....}
Registro de eventos: -
Cola: -
Consola: Starting to watch file ${filename}
```

A continuacion se crea el *watcher* y se comienza a detectar los cambios.

```
Pila de llamadas: watcher.on('change', () => {} || err => {.....}
Registro de eventos: -
Cola: -
Consola: -
```

Se introduce en el registro de eventos hasta que se produzca un cambio.

```
Pila de llamadas: - || err => {.....}
Registro de eventos: watcher.on('change', () => {}
Cola: -
Consola: -
```

```
Pila de llamadas: - || err => {.....}
Registro de eventos: watcher.on('change', () => {}
Cola: -
Consola: File ${filename} is no longer watched
```

Se queda esperando y cuando se produce un cambio.

```
Pila de llamadas: - 
Registro de eventos: watcher.on('change', () => {}
Cola: -
Consola: -
```

```
Pila de llamadas: - 
Registro de eventos: watcher.on('change', () => {}
Cola: console.log(`File ${filename} has been modified somehow`)
Consola: -
```

```
Pila de llamadas: - 
Registro de eventos: watcher.on('change', () => {}
Cola: -
Consola: File ${filename} has been modified somehow
```

Para cada modificación se volvera a reproducir de la misma forma porque el *watch* se quedará dentro de el registro de eventos.

* ¿Que hace la funcion access?

Esta función permite obtener informacion de acceso del fichero.

* ¿Para que sirve el objeto constants?

Este determina el nivel de acceso, existiendo 4 tipos:

- R_OK: si el fichero se puede leer
- W_OK: si el fichero puede ser escrito
- F_OK: si el fichero existe
- X_OK: si el fichero se puede ejecutar

# Ejercicio 2

## Funcionalidad

Se requiere una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. Este se debe realizar de dos formas diferentes, haciendo uso del metodo pipe y sin hacer uso del metodo pipe.

## Codigo

Para realizar esta aplicación vamos a crear dos funciones para cada una de las formas. Comenzaremos con la funcion que hace uso del metodo pipe, este deberá tener como parametros el fichero que se desea analizar en string y un boolean para cada posible opcion.

```
function pipe(file: string, optionlines: boolean, optionchar: boolean, optionwords: boolean): void {
```

Primero debemos filtrar los errores de acceso al fichero haciendo uso de *fs.access*.

```
fs.access(file, constants.F_OK, (err) => {
  if (err) {
    console.log(`${file} not exist`);
    process.exit(-1);
  } else {
    console.log(`${file} exist`);
```

Almacenando en wc el contenido del fichero y almacenamos en Output la información del proceso wc

```
const wc = spawn('wc', [file]);
let Output = '';

wc.stdout.on('data', (piece) => (Output += piece));
```

Por último, dividiremos en un array la información del proceso anteriormente extraida para usarla dependiendo de las opciones pasadas, redirigimos con un pipe la salida del *echo* hacia la salida del proceso, mostrando los resultados por consola.

```
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
```

Para la forma sin hacer uso de pipe, crearemos otra función con los mismos parametros y filtrando los errores de la misma forma. Lo que cambia es a la hora de comprobar los parametros pedidos. 

En este caso no haremos uso de *pipe*, sino que almacenaremos la información en una variable y la mostramos una vez finalizado la comprobación de las opciones pasadas.

```
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
```

Solo queda hacer uso del modulo **yargs** para implementarlo. Este se ejecutara con el comando *get* y tendra los mismos parametros que las funciones ademas de un parametro mas para saber en que modo se desea ejecutar.

```
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
```

Para saber que función ejecutar solo será necesario comprobar el parametro *pipe*, pero antes debemos comprobar que los parametros son correctos.

```
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
```

# Ejercicio 3

## Funcionalidad

Se nos pide realizar un programa que a partir de la practica 8 realizada anteriormente (aplicacion de gestion de notas), desarrollas una aplicación que reciba un usuario de la aplicación de notas y ña ruta donde se encuentran sus notas. Esta deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que el usuario interactua con la aplicación de procesamiento de notas.

## Codigo

Para realizar esto vamos a necesitar una función que usaremos para comprobar los cambios. Esta recibirá por parametro dos strings, uno para el nombre del usuario y otro para la ruta de las notas del usuario.

```
function watcher(user: string, route: string) {
```

Relizamos la comprobación de la ruta.

```
fs.access(route, constants.F_OK, (err) => {
  if (err) {
    console.log(`${route} not exist`);
    process.exit(-1);
  } else {
    console.log(`${route} exist`);
```

Y también la comprobación del usuario, usando *personalRoute* que tiene la ruta pasada añadiendo el usuario.

```
fs.access(personalRoute, constants.F_OK, (err) => {
  if (err) {
    console.log(`${user} not exist`);
    process.exit(-1);
  } else {
    console.log(`${user} exist`);
```

Hacemos uso de *watch* para comprobar los cambios que se van realizando en la ruta del usuario. Y comprobamos con *watcher.on* el tipo de cambio que se realiza para mostrar el mensaje en la consola.

```
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
```

Por último solo queda hacer uso del modulo yargs para pedir los dos parametros y ejecutar la funcion cuando estos sean correctos, pasando el usuario y la ruta. 

```
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
```

# Ejercicio 4

## Funcionalidad

Se pide realizar una aplicacion que permita hacer de wrapper de los distintos comando empleados en Linux para manejar los ficheros y directorios. Se debe poder realizar:

* Mostrar si es directorio o fichero dada una ruta.
* Crear un nuevo directorio a partir de una nueva ruta.
* Listar los ficheros dentro de un directorio.
* Mostrar el contenido de un fichero.
* Borrar ficheros y directorios.
* Mover y copiar ficheros y directorios de una ruta a otra.

## Codigo

Para realizar esta aplcación vamos a crear un comando para cada una de las posibles ejecuciones haciendo uso del modulo *yargs*. 

* **TYPE**

Comenzamos con el *type* que muestra si es un fichero o un directorio. Para esta ejecución solo será necesario una ruta.

```
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
```

Ahora comprobamos que la ruta sea un string y que este existe haciendo uso de *fs.lstat*. Una vez comprobado, usamos el metodo *.isFile()* para ver si es un fichero y mostrar el mensaje, en caso contrario mostrariamos que es un directorio.

```
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
```

* **MKDIR**

Para hacer este comando vamos a pedir de la misma forma la ruta para crear el directorio. Este debera crear un nuevo directorio en la ruta especificada.
 
Hacemos uso de *fs.mkdir* para crear el directorio y comprobamos que no ha ocurrido ningun error.

```
handler(argv) {
  if (typeof argv.path === 'string') {
    fs.mkdir(`${argv.path}`, {recursive: true}, (err) => {
      if (err) console.log('Error with the add');
    });
  }
},
```

* **LIST**

Para hacer este comando debemos pedir la ruta de la misma forma que anteriormente. Deberemos mostrar un listado de los ficheros de un directorio.

Primero comprobamos que existe el directorio que se ha pasado haciendo uso de *fs.readdir*, en caso de no existir error tendriamos en *files* los ficheros del directorio. Seguidamente mostramos el directorio que se ha pasado y mostramos cada uno de los ficheros.

```
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
```

* **CAT**

Para hacer este comando debemos pedir la ruta de la misma forma que los comando anteriores. Este deberá mostrar el contenido de un fichero que se le pasa.

Hacemos uso de *fs.readFile*, para comprobar que no existe error con la ruta. Si no existe problema con la ruta mostramos *data*, que almacena el contenido del fichero en un tipo Buffer, solo debemos tranformarlo a string.

```
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
```


* **RM**

Para hacer este comando debemos pedir la ruta de la misma forma que los comandos anteriores. Este deberá eliminar el directorio o fichero que se le pase.

Debemos comprobar que la ruta es valida usando *fs.lstat*, usando *stats.isFile()* podemos comprobar si es un fichero, en caso de que la ruta dirija a un fichero usaremos *fs.rm* para eliminar el fichero de la ruta comprobando que no exista error. En caso de que no sea un fichero, será un directorio por lo que debemos usar *rimraf* para que lo elimine recursivamente, comprobando que no suceda ningun error.

```
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
```


* **MV**

Para hacer este comando deberemos pedir la ruta del fichero o directorio que queremos mover y la ruta a la que lo queremos mover.

```
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
```

Para moverlo, hacemos uso de *fsExtra.move* pasandole la ruta en la que se encuentra y la ruta destino. Y comprobamos que no surja ningun problema.

```
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
```


* **CP**

Para hacer este comando deberemos pedir los parametros de la misma forma que con el MV, una ruta actual y la ruta destino. Se copiará el directorio o fichero de la ruta pasada a la ruta destino.

Para hacer la copia, se realiza de la misma forma que al moverlo, cambiando *fsExtra.move* por *fsExtra.copy*. Padamos la ruta en la que se encuentra y la ruta a la que queremos copiarlo, todo esto manejando el caso de que ocurra algun error.

```
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
```

Con esto ya tendriamos todos los comandos funcionales.


# Conclusion

Con la realización del ejercicio propuesto en esta práctica se ha podido profundizar en las diferentes funcionalidades que tienen las APIs DE Node.js, teniendo diversas formas de combinarlos para una mejor implementacion facilitando muchas tareas. Cada uno de estas funcionalidades tiene diferentes situaciones en las que nos puede ayudar, por lo que se debe conocer los diferentes momentos en los que se debe utilizar para agilizar el trabajo.

# Bibliografia

* [Yargs](https://www.npmjs.com/package/yargs)
* [Node file system](https://nodejs.org/api/fs.html)
* [Chokidar](https://chromium.googlesource.com/infra/third_party/npm_modules/+/e7396f39cd50de4419362fc2bc48360cb85ce555/node_modules/karma/node_modules/chokidar/README.md)
