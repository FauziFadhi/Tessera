import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
export const dirname = __dirname;
export class CreateCityTable1710598371355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cities',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'country_name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'cities',
      new TableIndex({
        columnNames: ['id'],
      }),
    );

    await queryRunner.createIndex(
      'cities',
      new TableIndex({
        columnNames: ['name', 'country_name'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'cities',
      new TableIndex({
        columnNames: ['name', 'country_name'],
        isUnique: true,
      }),
    );
    await queryRunner.dropIndex(
      'cities',
      new TableIndex({
        columnNames: ['id'],
      }),
    );
    await queryRunner.dropTable('cities');
  }
}
