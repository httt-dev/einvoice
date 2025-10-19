import { ApiProperty } from '@nestjs/swagger';

export class BaseEntityResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
