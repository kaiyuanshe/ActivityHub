import { Length, IsDateString, IsUrl, IsString } from 'class-validator';

export class ActivityModel {
    @Length(3)
    title: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @Length(3)
    address?: string;

    @IsUrl()
    url?: string;

    @IsUrl()
    banner?: string;

    @IsString()
    organizationId: string;
}
