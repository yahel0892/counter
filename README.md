## Empezando

Para empezar se necesita clonar el proyecto.

```{.bash}
git clone https://github.com/appuntos/fullstack-challenge
```

Después hay que dirigirse al directorio donde clono el proyecto.

```{.bash}
cd counter
```

Una vez posicionado dentro del proyecto debemos instalar las dependencias.
```{.bash}
npm install
```

Ahora hay que crear un archivo llamado .env dentro de la carpeta app y colocar el contenido del archivo txt que se compartió por correo.

Una vez agregado el contenido al archivo .env debemos de ejecutar la aplicación, para ello solo debemos ejecutar el seguiente comando:

```{.bash}
nodemon
```

En caso de no tener instalado nodemon en el equipo, hay que ejecutar el siguiente comando para instalarlo y luego realizar el paso anterior

```{.bash}
npm install -g nodemon
```

Una vez que la aplicación este corriendo hay que dirigirse al siguiente enlace para hacer las pruebas:

```{.bash}
http://localhost:3000/
```

Por último solo hay que hacer clic al botón generar guía para crear una guía y verificar el contador.
Puede actualizar el navegador o abrir tantas pestañas como sean necesarias incluso puede generar guías en diferentes pestañas y verá que el contador persiste mientras la aplicación se este ejecutando.
Una vez reiniciada la aplicación el contador se regresará a 0.