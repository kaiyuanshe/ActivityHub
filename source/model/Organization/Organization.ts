import { Length, IsUrl } from 'class-validator';

export class OrganizationModel {
    @Length(3)
    name: string;

    @Length(100)
    summary?: string;

    @IsUrl()
    logo?: string;

    @IsUrl()
    url?: string;
}
