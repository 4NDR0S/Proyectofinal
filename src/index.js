import express from 'express'

import { crearUsuario, verUsuarios, actualizarUsuario, eliminarUsuario, getId } from './usuario/usuarioCtrl.js'
import { manejarErrorArchivo } from './helper.js'

import { crearPublicacion, actualizarPublicacion, eliminarPublicacion, listaPublicaciones, filtrarCategoria, listaPubliTitulos } from './publicaciones/publiCtrl.js'
import { listaCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from './categorias/cateCtrl.js'
import { crearComentario, actualizarComentario, eliminarComentario, comentariosDePublicacion } from './comentarios/comenCtrl.js'

// swagger
import swaggerUi from 'swagger-ui-express'
import jsonDocs from './swagger-output.json' assert {type: 'json'}

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(jsonDocs))

// Rutas para USUARIOS
// Crear un usuario y mandarlo a la base de datos
app.post('/usuario/crear', crearUsuario, manejarErrorArchivo)

// Mostrar todos los usuarios de la base de datos (solo admin)
app.get('/usuarios', verUsuarios)

// Obtener el id del usuario, por medio de su nombre
app.get('/id/usuario/:nombre', getId)

// Actualizar usuario por medio de su user
app.put('/usuario/editar/:user', actualizarUsuario)

// Eliminar el usuario por medio de su user
app.delete('/usuario/eliminar/:user', eliminarUsuario)

// -                                                                        -
// Rutas para PUBLICACIONES
// Crear una publicacion por medio del id de usuario
app.post('/publicacion/crear', crearPublicacion)

// Actualizar publicacion por medio del id de publicacion
app.put('/publicacion/actualizar/:publiId', actualizarPublicacion)

// Eliminar publicacion por medio del id de publicacion
app.delete('/publicacion/eliminar/:publiId', eliminarPublicacion)

// Ver todas las publicaciones por id de usuario
app.get('/publicaciones/usuario/:userId', listaPublicaciones)

// Filtrar publicaciones por categoria
app.get('/publicaciones/categoria/:categoriaId', filtrarCategoria)

// Buscar publicaciones por titulo
app.get('/publicaciones/buscar/titulos', listaPubliTitulos)

// -                                                                        -
/// Rutas para CATEGORIAS
// Ver categorias
app.get('/categorias', listaCategorias)

// Crear categoria (admin)
app.post('/categoria/crear', crearCategoria)

// Actualizar categoria (admin)
app.put('/categoria/actualizar/:categoriaId', actualizarCategoria)

// Eliminar categoria (admin)
app.delete('/categoria/eliminar/:id', eliminarCategoria)

// -                                                                        -
// Rutas para COMENTARIOS
// Crear nuevo comentario
app.post('/comentario/crear', crearComentario)

// Actualizar comentario por medio de su id
app.put('/comentario/actualizar/:comentarioId', actualizarComentario)

// Eliminar comentario por medio de su id
app.delete('/comentario/:idC', eliminarComentario)

// Ver comentarios de una publicación por medio del id de la publicacion
app.get('/comentarios/publicacion/:idP', comentariosDePublicacion)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
