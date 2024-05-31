import { pool } from '../db.js'

// Ver todas las categorias con su respectivo id
export const listaCategorias = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categoria')
    res.json(rows)
  } catch (error) {
    console.error('Error al cargar los titulos de las categoriacaciones:', error)
    res.status(500).json({ error: 'Error al cargar los titulos de las categoriacaciones' })
  }
}

// Crear categoria (admin)
export const crearCategoria = async (req, res) => {
  const { rol, categoria } = req.body
  if (rol !== 1) {
    return res.status(400).json({ error: 'No tienes acceso para crear la categoria' })
  }

  if (!rol || !categoria) {
    return res.status(400).json({ error: 'rol, categoria son requeridos' })
  }

  try {
    const result = await pool.execute('INSERT INTO categoria (categoria) VALUES (?)', [categoria])
    const newCategoria = {
      id: result.insertId,
      categoria
    }
    res.status(201).json(newCategoria)
  } catch (error) {
    console.error('Error al crear categoria:', error)
    res.status(500).json({ error: 'Error al crear categoria' })
  }
}

// Actualizar categoria por medio del id (admin)
export const actualizarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId, 10)
  const { rol, categoria } = req.body
  if (rol !== 1) {
    return res.status(400).json({ error: 'No tienes acceso para crear la categoria' })
  }

  if (!rol || !categoria) {
    return res.status(400).json({ error: 'rol, categoria son requeridos' })
  }

  try {
    const [result] = await pool.execute('UPDATE categoria SET categoria = ? WHERE categoria_id = ?', [categoria, categoriaId])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'categoria no encontrado' })
    }
    res.json({ id: categoriaId, categoria })
  } catch (error) {
    console.error('Error al actualizar la categoria:', error)
    res.status(500).json({ error: 'Error al actualizar la categoria' })
  }
}

// Eliminar un categoria por id
export const eliminarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id, 10)
  const { rol } = req.body
  if (rol !== 1) {
    return res.status(400).json({ error: 'No tienes acceso para crear la categoria' })
  }

  if (!rol) {
    return res.status(400).json({ error: 'rol es requerido' })
  }

  try {
    const [result] = await pool.execute('DELETE FROM categoria WHERE categoria_id = ?', [categoriaId])
    res.status(400).json({ message: 'categoria eliminada' })
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error al eliminar categoria:', error)
    res.status(500).json({ error: 'Error al eliminar categoria' })
  }
}
