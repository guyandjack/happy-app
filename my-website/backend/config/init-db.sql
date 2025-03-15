-- Active: 1741967663581@@127.0.0.1@3306
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('user', 'admin') DEFAULT 'user',
  password VARCHAR(100) NOT NULL,
  passwordChangedAt DATETIME,
  createdAt DATETIME NOT NULL
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  excerpt VARCHAR(500),
  image VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  tags JSON,
  author INT NOT NULL,
  views INT DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  contentType ENUM('text', 'html_file') DEFAULT 'text',
  images JSON DEFAULT NULL,
  FOREIGN KEY (author) REFERENCES users(id)
);

-- Create index for faster queries
CREATE INDEX idx_article_category ON articles(category);
CREATE INDEX idx_article_createdAt ON articles(createdAt);

-- Create article_images table for tracking multiple images per article
CREATE TABLE IF NOT EXISTS article_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_alt VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
); 