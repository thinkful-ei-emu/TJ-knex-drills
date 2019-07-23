require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchItems(searchTerm) {
  knexInstance
    .select('id', 'name', 'price', 'category', 'date_added')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage *(page -1);
  knexInstance
    .select('id', 'name', 'price', 'category', 'date_added')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

function itemsAfterDate(daysAgo) {
  knexInstance
    .select('id', 'date_added')
    .from('shopping_list')
    .where('date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result);
    });
}

function costByCategory() {
  knexInstance
    .select('category', knexInstance.raw('SUM(price) AS total'))
    .from('shopping_list')
    .groupBy('category')
    .orderBy('total', 'ASC')
    .then(result => {
      console.log(result);
    });
}

costByCategory();