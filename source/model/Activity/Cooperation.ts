import { IsString, IsPositive, Length } from 'class-validator';

export class CooperationModel {
    @IsString()
    organizationId: string;

    @IsPositive()
    level: number;

    @Length(3)
    title: string;

    @IsString()
    contactId: string;
}
