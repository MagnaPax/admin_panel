import { Repository } from 'typeorm';

export class Query {
  async findRecords(
    id: number,
    tableName: string,
    columnName: string,
    repository: Repository<any>,
  ) {
    return repository
      .createQueryBuilder(tableName)
      .where(`${tableName}.${columnName} = :id`, { id })
      .getMany();
  }
}
