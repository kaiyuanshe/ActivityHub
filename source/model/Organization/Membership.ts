import { IsString, IsEnum } from 'class-validator';

export enum MemberRole {
    Admin,
    Worker
}

export class MemberModel {
    @IsString()
    userId: string;

    @IsEnum(MemberRole)
    role: MemberRole;
}
