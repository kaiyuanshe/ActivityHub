import { Length, IsPositive } from 'class-validator';

export class SessionModel {
    @Length(3)
    title: string;

    @Length(100)
    summary: string;

    @IsPositive()
    durationMinute: number;

    @IsPositive()
    peopleCapacity?: number;
}
