import { IsEnum, Length, IsPositive, IsArray, IsString } from 'class-validator';

export enum PlaceType {
    Room,
    Hall,
    Cafe,
    Restaurant
}

export enum DeviceType {
    Network,
    Projector,
    LED,
    Microphone
}

export class PlaceModel {
    @IsEnum(PlaceType)
    type: PlaceType;

    @Length(3)
    name: string;

    @Length(10)
    address?: string;

    @IsPositive()
    size: number;

    @IsArray()
    devices: DeviceType[];

    @IsArray()
    openWeekDays: number[];

    @IsString()
    openTime: string;

    @IsString()
    closeTime: string;
}
