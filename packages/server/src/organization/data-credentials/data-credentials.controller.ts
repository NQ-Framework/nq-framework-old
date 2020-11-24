import { Body, Controller, Get, NotFoundException, Post, Req } from '@nestjs/common';
import { DataCredentials, DataCredentialsType } from "@nqframework/models"
import { Request } from 'express';
import { OrganizationService } from '../organization.service';
import { DataCredentialsService } from './data-credentials.service';

@Controller('data-credentials')
export class DataCredentialsController {
    constructor(private credentialsService: DataCredentialsService, private organizationService: OrganizationService) { }

    @Get("types")
    async GetCredentialTypes(): Promise<DataCredentialsType[]> {
        return await this.credentialsService.getCredentialTypes();
    }

    @Post("types")
    async CreateCredentialType(@Body() newType: DataCredentialsType): Promise<void> {
        return await this.credentialsService.createCredentialType(newType);
    }


    @Post("")
    async CreateCredentials(@Req() req: Request, @Body() newCredentials: DataCredentials): Promise<void> {
        if (!req.organizationId) {
            throw new NotFoundException();
        }
        const organization = await this.organizationService.getOrganization(req.organizationId);
        if (!organization) {
            throw new NotFoundException();
        }
        if (!organization.dataCredentials) {
            organization.dataCredentials = [];
        }
        organization.dataCredentials.push(newCredentials);
        await this.organizationService.updateOrganization(organization);
    }
}
