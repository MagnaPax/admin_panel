import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Query {
  async findRecordsByValues(
    values: any[],
    columnNames: string[],
    repository: Repository<any>,
  ): Promise<any[]> {
    const queryBuilder = repository.createQueryBuilder();
    const tableName = repository.metadata.name;

    const conditions = [];

    columnNames.forEach((columnName, index) => {
      if (values[index] === null) {
        conditions.push(`${tableName}.${columnName} IS NULL`);
      } else {
        conditions.push(`${tableName}.${columnName} = :value${index}`);
        queryBuilder.setParameter(`value${index}`, values[index]);
      }
    });

    queryBuilder.where(conditions.join(' OR '));

    return await queryBuilder.getMany();
  }

  async updateRecords(
    records: any[],
    updateProps: Record<string, any>,
    repository: Repository<any>,
  ) {
    for (const record of records) {
      for (const key in updateProps) {
        if (updateProps.hasOwnProperty(key)) {
          record[key] = updateProps[key];
        }
      }
      await repository.save(record);
    }
  }
}
