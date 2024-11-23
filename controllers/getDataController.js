const pool = require("../config/dbConfig");
const { dataRes } = require("../utils/response");

async function getUsers(req, res, next) {
  const { search, sortBy, order, dateFilter, startsWith, endsWith } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    let query = `
        SELECT CONCAT(u.first_name, ' ', u.last_name) as name, u.username, c.name as category, t.amount as expense, t.date as date 
        FROM users u 
        INNER JOIN transactions t ON u.id = t.user_id
        LEFT JOIN categories c on t.category_id = c.id
        WHERE u.roles = 'user' 
    `;
    let updates = [];
    let values = [];
    if (search) {
      updates.push(
        `AND (u.first_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.last_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.username ILIKE '%' || $${updates.length + 1} || '%')`
      );
      values.push(search);
    }

    if (dateFilter || startsWith || endsWith) {
      if (dateFilter) {
        updates.push(`date >= CURRENT_DATE - INTERVAL $${updates.length + 1}`);
        values.push(dateFilter);
      } else {
        if (startsWith) {
          updates.push(`date >= $${updates.length + 1}`);
          values.push(startsWith);
        }
        if (endsWith) {
          updates.push(`date < $${updates.length + 1}`);
          values.push(endsWith);
        }
      }
    }

    if (updates.length > 0) {
      query += updates.join(" AND ");
    }

    if (sortBy) {
      query += ` ORDER BY $${sortBy}`;
      if (order) {
        query += ` ${order.toupperCase()}`;
      }
    }

    query += ` LIMIT $${updates.length + 1} OFFSET $${updates.length + 2}`;

    values.push(limit, offset);
    const result = await pool.query(query, values);
    return dataRes(res, 200, result.rows, "Data berhasil diambil", page, limit);
  } catch (err) {
    next(err);
  }
}

async function usersExpenseSum(req, res, next) {
  const { search, dateFilter, startsWith, sortBy, order } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    let query = `
        SELECT CONCAT(u.first_name, ' ', u.last_name) as name, u.username, SUM(t.amount) as total_expenses
        FROM users u INNER JOIN transactions t ON u.id = t.user_id
        WHERE u.roles = 'user' 
    `;
    let updates = [];
    let values = [];
    if (search) {
      updates.push(
        `AND (u.first_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.last_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.username ILIKE '%' || $${updates.length + 1} || '%')`
      );
      values.push(search);
    }
    if (dateFilter || startsWith || endsWith) {
      if (dateFilter) {
        updates.push(`date >= CURRENT_DATE - INTERVAL $${updates.length + 1}`);
        values.push(dateFilter);
      } else {
        if (startsWith) {
          updates.push(`date >= $${updates.length + 1}`);
          values.push(startsWith);
        }
        if (endsWith) {
          updates.push(`date < $${updates.length + 1}`);
          values.push(endsWith);
        }
      }
    }

    if (updates.length > 0) {
      query += updates.join(" AND ");
    }

    query += `GROUP BY u.first_name, u.last_name, u.username`;

    if (sortBy) {
      query += ` ORDER BY $${sortBy}`;
      if (order) {
        query += ` ${order.toupperCase()}`;
      }
    }

    query += ` LIMIT $${updates.length + 1} OFFSET $${updates.length + 2}`;

    values.push(limit);
    values.push(offset);
    const result = await pool.query(query, values);
    return dataRes(res, 200, result.rows, "Data berhasil diambil", page, limit);
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  const username = req.user.username;
  const { search, dateFilter, startsWith, endsWith, sortBy, order } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    let query = `
      SELECT t.id, c.name, t.amount, t.description, t.date
      FROM transactions t
      INNER JOIN categories c ON t.category_id = c.id
      INNER JOIN users u ON u.id = t.user_id WHERE u.username = '${username}' 
    `;
    let updates = [];
    let values = [];
    if (search) {
      updates.push(
        `AND (u.first_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.last_name ILIKE '%' || $${
          updates.length + 1
        } || '%' OR u.username ILIKE '%' || $${updates.length + 1} || '%')`
      );
      values.push(search);
    }
    if (dateFilter || startsWith || endsWith) {
      if (dateFilter) {
        updates.push(`date >= CURRENT_DATE - INTERVAL $${updates.length + 1}`);
        values.push(dateFilter);
      } else {
        if (startsWith) {
          updates.push(`date >= $${updates.length + 1}`);
          values.push(startsWith);
        }
        if (endsWith) {
          updates.push(`date < $${updates.length + 1}`);
          values.push(endsWith);
        }
      }
    }

    if (updates.length > 0) {
      query += updates.join(" AND ");
    }

    if (sortBy) {
      query += ` ORDER BY $${sortBy}`;
      if (order) {
        query += ` ${order.toupperCase()}`;
      }
    }

    query += ` LIMIT $${updates.length + 1} OFFSET $${updates.length + 2}`;
    values.push(limit);
    values.push(offset);
    const result = await pool.query(query, values);
    return dataRes(res, 200, result.rows, "Data berhasil diambil", page, limit);
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    return dataRes(res, 200, result.rows, "Data berhasil diambil.");
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, usersExpenseSum, getTransactions, getCategories };
