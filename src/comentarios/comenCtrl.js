import { pool } from '../db.js'

// Crear nuevo comentario
export const crearComentario = async (req, res) => {
  const { contenido, idUser, idPubli } = req.body
  if (!contenido || !idUser || !idPubli) {
    return res.status(400).json({ error: 'contenido, idUser, idPubli son requeridos' })
  }

  const fecha = new Date() // Genera la fecha actual
  try {
    const result = await pool.execute('INSERT INTO comentario (contenido_c, fecha_creacion, id_usuario, id_comentario) VALUES (?, ?, ?, ?)', [contenido, fecha, idUser, idPubli])
    const newComentario = {
      id: result.insertId,
      fecha,
      idUser,
      idPubli
    }
    res.status(201).json(newComentario)
  } catch (error) {
    console.error('Error al crear comentario:', error)
    res.status(500).json({ error: 'Error al crear comentario' })
  }
}

// Actualizar comentario por medio de su id
export const actualizarComentario = async (req, res) => {
  const comentarioId = parseInt(req.params.comentarioId, 10)
  const { contenido } = req.body

  try {
    const [result] = await pool.execute('UPDATE comentario SET contenido_c = ? WHERE id_comentario = ?', [contenido, comentarioId])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'comentario no encontrada' })
    }
    res.json({ id: comentarioId, contenido })
  } catch (error) {
    console.error('Error al actualizar comentario:', error)
    res.status(500).json({ error: 'Error al actualizar comentario' })
  }
}

// Eliminar comentario por medio de su id
export const eliminarComentario = async (req, res) => {
  const comentarioId = parseInt(req.params.idC, 10)

  try {
    const [result] = await pool.execute('DELETE FROM comentario WHERE id_comentario = ?', [comentarioId])
    res.status(400).json({ message: 'comentario eliminado' })
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'comentario no encontrado' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    res.status(500).json({ error: 'Error al eliminar comentario' })
  }
}

// Ver comentarios de una publicación por medio del id de la publicacion
export const comentariosDePublicacion = async (req, res) => {
  const idP = parseInt(req.params.idP, 10)
  try {
    const [rows] = await pool.execute('SELECT * FROM comentario WHERE id_publicacion = ?', [idP])
    res.json(rows)
  } catch (error) {
    console.error('Error al obtener la lista de comentarios:', error)
    res.status(500).json({ error: 'Error al obtener la lista de comentarios' })
  }
}
