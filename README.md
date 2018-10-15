#Aplicación de servicio rest con node.js

Ejecutar npm install para instalar dependencias.

loguear usuario servicio post:
https://johnvanegas-restserver-node.herokuapp.com/login



username:
test3@gmail.com

password:
123


#Nota
Para usar cualquier servicio debe haberse logueado previamente, ya que se genera un token el cual permite el uso de los servicios, al hacer cualquier petición se debe enviar en el headers el token.

Crear usuario, servicio post:
https://johnvanegas-restserver-node.herokuapp.com/usuario

datos requeridos:
nombre
email
password

Consultar usuario, servicio get:
https://johnvanegas-restserver-node.herokuapp.com/usuario


Consultar usuario paginado, servicio get:
https://johnvanegas-restserver-node.herokuapp.com/usuario?limite=10&desde=0


Eliminar usuario, servicio put:
https://johnvanegas-restserver-node.herokuapp.com/usuario/id


Crear categoria, servicio post:
https://johnvanegas-restserver-node.herokuapp.com/categoria

datos requeridos:
descripcion

Actualizar categoria, servicio put:
https://johnvanegas-restserver-node.herokuapp.com/categoria/id

datos requeridos:
descripcion

Eliminar categoria, servicio delete:
https://johnvanegas-restserver-node.herokuapp.com/categoria/id


Consultar todas las categorias, servicio get:
https://johnvanegas-restserver-node.herokuapp.com/categoria


Consultar categoria por id, servicio get:
https://johnvanegas-restserver-node.herokuapp.com/categoria/id

