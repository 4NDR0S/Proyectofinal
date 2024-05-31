import { pool } from '../db.js'

// Crear usuario
export const crearUsuario = async (req, res) => {
  const { usuario, nombre, apellido, email, password, rol } = req.body
  if (!usuario || !nombre || !apellido || !email || !password || !rol) {
    return res.status(400).json({ error: 'nombre, email, password, rol son requeridos' })
  }

  try {
    const result = await pool.execute('INSERT INTO usuario (user, nombre, apellido, email, pass, rol) VALUES (?, ?, ?, ?, ?, ?)', [usuario, nombre, apellido, email, password, rol])
    const newUser = {
      id_usuario: result.insertId,
      usuario,
      nombre,
      apellido,
      email,
      password,
      rol
    }
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

// Ver todos los usuarios regristados (solo admin)
export const verUsuarios = async (req, res) => {
  const { rol } = req.body
  if (rol !== 1) {
    return res.status(400).json({ error: 'No tienes acceso para ver a los usuarios' })
  }

  if (!rol) {
    return res.status(400).json({ error: 'rol es requerido' })
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM usuario')
    res.json(rows)
  } catch (error) {
    console.error('Error al cargar los usuarios:', error)
    res.status(500).json({ error: 'Error al cargar los usuarios' })
  }
}

// Actualizar usuario por medio del user
export const actualizarUsuario = async (req, res) => {
  const user = req.params.user
  const { nombre, apellido, email, password, rol } = req.body

  try {
    const [result] = await pool.execute('UPDATE usuario SET nombre = ?, apellido = ?, email = ?, pass = ?, rol = ? WHERE user = ?', [nombre, apellido, email, password, rol, user])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ user, nombre, apellido, email, password, rol })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
}

// Eliminar usuario por medio del user
export const eliminarUsuario = async (req, res) => {
  const user = req.params.user

  try {
    const [result] = await pool.execute('DELETE FROM usuario WHERE user = ?', [user])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
}

// Obtener el id del usuario, por medio de su nombre
export const getId = async (req, res) => {
  const nombre = req.params.nombre

  try {
    const [rows] = await pool.execute('SELECT id_usuario FROM usuario WHERE nombre = ?', [nombre])
    res.json(rows)
  } catch (error) {
    console.error('Error al cargar los usuarios:', error)
    res.status(500).json({ error: 'Error al cargar los usuarios' })
  }
}
