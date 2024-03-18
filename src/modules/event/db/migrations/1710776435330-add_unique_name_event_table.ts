import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddUniqueNameEventTable1710776435330
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'events',
      new TableIndex({
        columnNames: ['city_id', 'name'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'events',
      new TableIndex({
        columnNames: ['city_id', 'name'],
        isUnique: true,
      }),
    );
  }
}
