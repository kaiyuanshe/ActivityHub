import { Length, Matches, IsUrl } from 'class-validator';

export class OrganizationModel {
    @Length(3)
    name: string;

    @Matches(/^[A-Za-z-]+$/)
    englishName: string;

    @Length(100)
    summary?: string;

    @IsUrl()
    logo?: string;

    @IsUrl()
    url?: string;
}
