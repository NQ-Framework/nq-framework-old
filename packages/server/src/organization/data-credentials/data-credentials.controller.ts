import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataCredentialsType } from "@nqframework/models"
import { DataCredentialsService } from './data-credentials.service';

@Controller('data-credentials')
export class DataCredentialsController {
    constructor(private credentialsService: DataCredentialsService) { }

    @Get("types")
    async GetCredentialTypes(): Promise<DataCredentialsType[]> {
        return await this.credentialsService.getCredentialTypes();
    }

    @Post("types")
    async CreateCredentialType(@Body() newType: DataCredentialsType): Promise<void> {
        return await this.credentialsService.createCredentialType(newType);
    }
}
