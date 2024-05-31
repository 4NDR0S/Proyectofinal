import { pool } from '../db.js'

// Crear nueva publicacion
export const crearPublicacion = async (req, res) => {
  const { titulo, contenido, idUser } = req.body
  if (!titulo || !contenido || !idUser) {
    return res.status(400).json({ error: 'titulo, contenido, id_usuario son requeridos' })
  }

  const fecha = new Date() // Genera la fecha actual
  try {
    const result = await pool.execute('INSERT INTO publicacion (titulo, contenido, fecha_creacion, id_usuario) VALUES (?, ?, ?, ?)', [titulo, contenido, fecha, idUser])
    const newPubli = {
      id: result.insertId,
      titulo,
      contenido,
      fecha,
      idUser
    }
    res.status(201).json(newPubli)
  } catch (error) {
    console.error('Error al crear publicacion:', error)
    res.status(500).json({ error: 'Error al crear publicacion' })
  }
}

// Actualizar publicacion por medio del id de publicacion
export const actualizarPublicacion = async (req, res) => {
  const publiId = parseInt(req.params.publiId, 10)
  const { titulo, contenido } = req.body

  try {
    const [result] = await pool.execute('UPDATE publicacion SET titulo = ?, contenido = ? WHERE id_publicacion = ?', [titulo, contenido, publiId])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Publicacion no encontrada' })
    }
    res.json({ id: publiId, titulo, contenido })
  } catch (error) {
    console.error('Error al actualizar publicacion:', error)
    res.status(500).json({ error: 'Error al actualizar publicacion' })
  }
}

// Eliminar publicacion por medio del id de publicacion
export const eliminarPublicacion = async (req, res) => {
  const publiId = parseInt(req.params.publiId, 10)

  try {
    const [result] = await pool.execute('DELETE FROM publicacion WHERE id_publicacion = ?', [publiId])
    res.status(400).json({ message: 'publicacion eliminada' })
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Publicacion no encontrada' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error al eliminar publicacion:', error)
    res.status(500).json({ error: 'Error al eliminar publicacion' })
  }
}
// Ver todas las publicaciones por id de usuario
export const listaPublicaciones = async (req, res) => {
  const userId = parseInt(req.params.userId, 10)

  try {
    const [rows] = await pool.execute('SELECT * FROM publicacion WHERE id_usuario = ?', [userId])
    res.json(rows)
  } catch (error) {
    console.error('Error al obtener lista de publicaciones:', error)
    res.status(500).json({ error: 'Error al obtener lista de publicaciones' })
  }
}

// Filtrar publicaciones por categoria
export const filtrarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId, 10)

  try {
    const [result] = await pool.execute('SELECT * FROM publicacion p JOIN categoria_publicacion cp ON p.id_publicacion = cp.publicacion_id WHERE cp.categoria_id = ?', [categoriaId])
    res.json(result)
  } catch (error) {
    console.error('Error al filtrar la categoria solicitada:', error)
    res.status(500).json({ error: 'Error al filtrar la categoria solicitada' })
  }
}

// Buscar publicaciones por titulo
export const listaPubliTitulos = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT titulo FROM publicacion')
    res.json(rows)
  } catch (error) {
    console.error('Error al cargar los titulos de las publicaciones:', error)
    res.status(500).json({ error: 'Error al cargar los titulos de las publicaciones' })
  }
}
