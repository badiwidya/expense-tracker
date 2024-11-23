const pool = require("../config/dbConfig");
const { successRes, errorRes } = require("../utils/response");

async function createTransactions(req, res, next) {
  const user_id = req.user.id;
  const { category_id, amount, description, date } = req.body;
  try {
    const query = `INSERT INTO transactions (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const result = await pool.query(query, [
      user_id,
      category_id,
      amount,
      description,
      date,
    ]);
    if (result.rows.length === 0) {
      errorRes(res, 400, "Gagal memasukkan data.");
    }
    return successRes(res, 200, "Data berhasil dibuat.", result.rows);
  } catch (err) {
    next(err);
  }
}

async function deleteTransactions(req, res, next) {
  const id = req.params.id;
  try {
    const query = `DELETE FROM transactions WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return successRes(res, 200, "Data berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
}

async function editTransactions(req, res, next) {
  const id = req.params.id;
  const { category_id, description, amount, date } = req.body;
  try {
    let query = `UPDATE transactions SET `;
    let updates = [];
    let values = [];
    if (category_id) {
      updates.push(`category_id = $${updates.length + 1}`);
      values.push(parseInt(category_id));
    }
    if (description) {
      updates.push(`description = $${updates.length + 1}`);
      values.push(description);
    }
    if (amount) {
      updates.push(`amount = $${updates.length + 1}`);
      values.push(parseInt(amount));
    }
    if (date) {
      updates.push(`date = $${updates.length + 1}`);
      values.push(date);
    }

    if (updates.length > 0) {
      query += updates.join(", ");
    }
    query += ` WHERE id = $${updates.length + 1} RETURNING id`;
    values.push(id);
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      successRes(res, 200, "Update berhasil.", result.rows);
    }
  } catch (err) {
    next(err);
  }
}

async function createCategories(req, res, next) {
	const {name, description} = req.body;
	try {
		const result = await pool.query(`INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id;`, [name, description])
		if (result.rows.length > 0) {
			return successRes(res, 200, "Data berhasil dibuat.", result.rows);
		}
	} catch (err) {
		next(err);
	}
}

module.exports = { createTransactions, editTransactions, deleteTransactions, createCategories };
