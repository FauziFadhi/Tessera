import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateEventTable1710656724153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
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
            name: 'city_id',
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'events',
      new TableIndex({
        columnNames: ['city_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.dropIndex(
      'events',
      new TableIndex({
        columnNames: ['city_id'],
      }),
    );
    await queryRunner.dropTable('events');
  }
}
