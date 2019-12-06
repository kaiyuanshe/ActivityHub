import { IsString, IsArray, IsBoolean } from 'class-validator';

export class SessionSubmitModel {
    @IsString()
    activityId: string;

    @IsArray()
    mentorIds?: string[];

    @IsBoolean()
    adopted?: boolean;
}
