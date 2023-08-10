import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '../entity/product.js';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'mydb',
  synchronize: true,
  logging: false,
  entities: [Product],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
