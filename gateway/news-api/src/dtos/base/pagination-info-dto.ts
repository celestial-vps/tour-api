import { ApiProperty } from "@nestjs/swagger";

export class PaginationInfo {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Page size' })
  size: number;

  @ApiProperty({ example: 9, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Total number of pages' })
  totalPages: number;
}