import { IsString, IsPositive, Length } from 'class-validator';

export class CooperationModel {
    @IsString()
    activityId: string;

    @IsPositive()
    level: number;

    @Length(3)
    title: string;

    @IsString()
    contactId: string;
}
