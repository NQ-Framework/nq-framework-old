import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { getOrganizationIdFromDomain } from './get-organization-id-from-domain';

/* eslint-disable @typescript-eslint/no-namespace */
export class OrganizationMiddleware implements NestMiddleware {
  use(req: Request, _: any, next: Function) {
    const subdomain =
      req.subdomains && req.subdomains.find((sd: string) => sd !== 'server');
    if (subdomain) {
      const orgId = getOrganizationIdFromDomain(subdomain);
      req.organizationId = orgId;
    } else {
      if (req.query['organizationId']) {
        req.organizationId = getOrganizationIdFromDomain(
          req.query['organizationId'].toString(),
        );
      }
    }
    if (req.query['dataSource']) {
      req.dataSource = req.query['dataSource'].toString();
    }
    next();
  }
}

declare global {
  namespace Express {
    interface Request {
      organizationId: string;
      dataSource: string;
    }
  }
}
