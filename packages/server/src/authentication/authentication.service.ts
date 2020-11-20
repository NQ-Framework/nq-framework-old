import { HttpService, Injectable } from '@nestjs/common';
import { UserToken } from '@nqframework/models';
import { AuthConfigService } from '../config/AuthConfigService';
import { LoggerService } from '../core/logger.service';

@Injectable()
export class AuthenticationService {

    constructor(private logger: LoggerService, private http: HttpService, private authConfig: AuthConfigService) {
        logger.setContext("Authentication Service");
    }

    async loginUserWithEmailAndPassword(email: string, password: string): Promise<UserToken> {
        this.logger.debug(`Logging in user ${email} with password`);
        try {
            const result = await this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.authConfig.webApiKey}`, {
                email,
                password,
                returnSecureToken: true
            }, {
                headers: {
                    'content-type': 'application/json'
                }
            }).toPromise();
            this.logger.debug(`successful authentication for ${email}`)
            return result.data;
        }
        catch (error) {
            this.logger.error(`failed logging in user ${email}`, error);
            throw new Error(error);
        }
    }
}
