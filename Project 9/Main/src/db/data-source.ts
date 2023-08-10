import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '../entity/product.js';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [Product],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
