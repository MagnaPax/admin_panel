import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Query {
  async findRecordsById(
    id: number,
    tableName: string,
    columnName: string,
    repository: Repository<any>,
  ): Promise<any[]> {
    return repository
      .createQueryBuilder(tableName)
      .where(`${tableName}.${columnName} = :id`, { id })
      .getMany();
  }

  async findRecordsByValues(
    values: any[],
    columnNames: string[],
    repository: Repository<any>,
  ): Promise<any[]> {
    const queryBuilder = repository.createQueryBuilder();
    const tableName = repository.metadata.name;

    columnNames.forEach((columnName, index) => {
      if (values[index] === null) {
        queryBuilder.andWhere(`${tableName}.${columnName} IS NULL`);
      } else {
        queryBuilder.andWhere(`${tableName}.${columnName} = :value${index}`, {
          [`value${index}`]: values[index],
        });
      }
    });
    return await queryBuilder.getMany();
  }
}
