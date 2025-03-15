const bcrypt = require('bcryptjs');
const { getConnection, releaseConnection } = require('../config/database');

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.password = user.password;
    this.passwordChangedAt = user.passwordChangedAt;
    this.createdAt = user.createdAt;
  }

  static async findById(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    } finally {
      releaseConnection(connection);
    }
  }

  static async findOne(criteria) {
    let connection;
    try {
      connection = await getConnection();
      
      // Step 1: Find user by email only
      if (criteria.email) {
        const [rows] = await connection.execute(
          'SELECT * FROM users WHERE email = ?',
          [criteria.email]
        );
        
        if (!rows.length) {
          return null;
        }

        // Step 2: If password needs to be verified
        if (criteria.password) {
          const user = new User(rows[0]);
          const isPasswordValid = await user.correctPassword(
            criteria.password,
            rows[0].password
          );

          return isPasswordValid ? user : null;
        }

        return new User(rows[0]);
      }
      return null;
    } catch (error) {
      throw error;
    } finally {
      releaseConnection(connection);
    }
  }

  async correctPassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  changedPasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }

  static async create(userData) {
    let connection;
    try {
      connection = await getConnection();
      
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, role, password, createdAt) VALUES (?, ?, ?, ?, ?)',
        [
          userData.name,
          userData.email,
          userData.role || 'user',
          hashedPassword,
          new Date()
        ]
      );
      
      const [newUser] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      
      return new User(newUser[0]);
    } catch (error) {
      throw error;
    } finally {
      releaseConnection(connection);
    }
  }
}

module.exports = User; 