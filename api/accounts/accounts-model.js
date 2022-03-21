const db = require('../../data/db-config')

const getAll = async () => {
    const rows = await db('accounts')
    return rows;
}

const getById = (id) => {
    return db("accounts").where({id}).first();
};


const create = account => {
    return db('accounts')
        .insert(account)
        .then(([id]) => getById(id))
}

const updateById = async (id, account) => {
    await db('accounts')
        .where('id', '=', id)
        .update(account)
    const updated = await getById(id)
    return updated
}

const checkName = async (name) => {
    const [account] = await db('accounts')
        .where('name', '=', name)

    return account
}

const deleteById = id => {
    return db('accounts')
        .where('id', '=', id)
        .del();
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    checkName,
    deleteById,
}
