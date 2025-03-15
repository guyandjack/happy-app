const slugify = require('slugify');
const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

class Article {
  constructor(article) {
    this.id = article.id;
    this.title = article.title;
    this.slug = article.slug;
    this.content = article.content;
    this.contentType = article.contentType || 'text';
    this.excerpt = article.excerpt;
    this.image = article.image; // Main featured image
    this.images = article.images ? (typeof article.images === 'string' ? JSON.parse(article.images) : article.images) : [];
    this.category = article.category;
    this.tags = article.tags ? (typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags) : [];
    this.author = article.author;
    this.authorName = article.authorName;
    this.views = article.views;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
  }

  static async find(criteria = {}, options = {}) {
    try {
      let query = 'SELECT a.*, u.name as authorName FROM articles a LEFT JOIN users u ON a.author = u.id';
      const queryParams = [];
      
      // Add WHERE clause if criteria provided
      if (Object.keys(criteria).length > 0) {
        const whereConditions = [];
        
        Object.entries(criteria).forEach(([key, value]) => {
          whereConditions.push(`a.${key} = ?`);
          queryParams.push(value);
        });
        
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add ORDER BY
      if (options.sort) {
        query += ` ORDER BY a.${options.sort}`;
      } else {
        query += ' ORDER BY a.createdAt DESC';
      }
      
      // Add LIMIT and OFFSET for pagination
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));
        
        if (options.skip) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.skip));
        }
      }
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows.map(row => new Article(row));
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT a.*, u.name as authorName FROM articles a LEFT JOIN users u ON a.author = u.id WHERE a.id = ?',
        [id]
      );
      
      return rows.length ? new Article(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async countDocuments(criteria = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM articles';
      const queryParams = [];
      
      // Add WHERE clause if criteria provided
      if (Object.keys(criteria).length > 0) {
        const whereConditions = [];
        
        Object.entries(criteria).forEach(([key, value]) => {
          whereConditions.push(`${key} = ?`);
          queryParams.push(value);
        });
        
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  static async create(articleData) {
    try {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Create slug from title
        const slug = slugify(articleData.title, { lower: true });
        
        // Convert tags and images arrays to JSON strings
        const tags = JSON.stringify(articleData.tags || []);
        const images = JSON.stringify(articleData.images || []);
        
        // Insert article
        const [result] = await connection.execute(
          `INSERT INTO articles 
          (title, slug, content, contentType, excerpt, image, images, category, tags, author, views, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            articleData.title,
            slug,
            articleData.content,
            articleData.contentType || 'text',
            articleData.excerpt || '',
            articleData.image || '',
            images,
            articleData.category,
            tags,
            articleData.author,
            0,
            new Date(),
            new Date()
          ]
        );
        
        const articleId = result.insertId;
        
        // Insert individual images if provided
        if (articleData.imageDetails && articleData.imageDetails.length > 0) {
          const imageValues = articleData.imageDetails.map((img, index) => [
            articleId,
            img.url,
            img.alt || '',
            index,
            new Date()
          ]);
          
          const placeholders = imageValues.map(() => '(?, ?, ?, ?, ?)').join(', ');
          
          await connection.execute(
            `INSERT INTO article_images 
            (article_id, image_url, image_alt, display_order, created_at) 
            VALUES ${placeholders}`,
            imageValues.flat()
          );
        }
        
        await connection.commit();
        
        return await Article.findById(articleId);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  static async findByIdAndUpdate(id, updateData) {
    try {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Update slug if title is changed
        if (updateData.title) {
          updateData.slug = slugify(updateData.title, { lower: true });
        }
        
        // Convert tags and images arrays to JSON strings if provided
        if (updateData.tags) {
          updateData.tags = JSON.stringify(updateData.tags);
        }
        
        if (updateData.images) {
          updateData.images = JSON.stringify(updateData.images);
        }
        
        // Add updatedAt
        updateData.updatedAt = new Date();
        
        // Build SET clause
        const setClause = Object.keys(updateData)
          .filter(key => key !== 'imageDetails')
          .map(key => `${key} = ?`)
          .join(', ');
        
        const values = Object.entries(updateData)
          .filter(([key]) => key !== 'imageDetails')
          .map(([_, value]) => value);
        
        values.push(id);
        
        await connection.execute(
          `UPDATE articles SET ${setClause} WHERE id = ?`,
          values
        );
        
        // Handle image details if provided
        if (updateData.imageDetails && updateData.imageDetails.length > 0) {
          // Delete existing images
          await connection.execute(
            'DELETE FROM article_images WHERE article_id = ?',
            [id]
          );
          
          // Insert new images
          const imageValues = updateData.imageDetails.map((img, index) => [
            id,
            img.url,
            img.alt || '',
            index,
            new Date()
          ]);
          
          const placeholders = imageValues.map(() => '(?, ?, ?, ?, ?)').join(', ');
          
          await connection.execute(
            `INSERT INTO article_images 
            (article_id, image_url, image_alt, display_order, created_at) 
            VALUES ${placeholders}`,
            imageValues.flat()
          );
        }
        
        await connection.commit();
        
        return await Article.findById(id);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  async remove() {
    try {
      await pool.execute(
        'DELETE FROM articles WHERE id = ?',
        [this.id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async findPrevious(id, category = null) {
    try {
      let query = `
        SELECT a.*, u.name as authorName 
        FROM articles a 
        LEFT JOIN users u ON a.author = u.id 
        WHERE a.id < ?
      `;
      
      const queryParams = [id];
      
      if (category) {
        query += ' AND a.category = ?';
        queryParams.push(category);
      }
      
      query += ' ORDER BY a.id DESC LIMIT 1';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows.length ? new Article(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findNext(id, category = null) {
    try {
      let query = `
        SELECT a.*, u.name as authorName 
        FROM articles a 
        LEFT JOIN users u ON a.author = u.id 
        WHERE a.id > ?
      `;
      
      const queryParams = [id];
      
      if (category) {
        query += ' AND a.category = ?';
        queryParams.push(category);
      }
      
      query += ' ORDER BY a.id ASC LIMIT 1';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows.length ? new Article(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Add method to get article with all images
  static async findByIdWithImages(id) {
    try {
      const [articleRows] = await pool.execute(
        'SELECT a.*, u.name as authorName FROM articles a LEFT JOIN users u ON a.author = u.id WHERE a.id = ?',
        [id]
      );
      
      if (!articleRows.length) return null;
      
      const article = new Article(articleRows[0]);
      
      // Get all images for this article
      const [imageRows] = await pool.execute(
        'SELECT * FROM article_images WHERE article_id = ? ORDER BY display_order',
        [id]
      );
      
      article.imageDetails = imageRows;
      
      return article;
    } catch (error) {
      throw error;
    }
  }

  // Method to read HTML content from file
  static async readHtmlContent(filePath) {
    try {
      return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read HTML file: ${error.message}`);
    }
  }
}

module.exports = Article; 