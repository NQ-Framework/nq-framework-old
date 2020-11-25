import { Organization } from "@nqframework/models";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import * as React from "react";
import { UserService } from "../services/user.service";

export type OrganizationContext = {
    organization: Organization | null,
    organizations: Organization[],
    setOrganization: (organization: Organization | null) => void
}

export const organizationContext = createContext<OrganizationContext>({ organization: null, organizations: [], setOrganization: () => { } });

export const OrganizationProvider = ({ children }: any) => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const changeOrg = useCallback((org: Organization | null) => {
        if (org) {
            localStorage.setItem("organization", JSON.stringify(org));
        }
        else {
            localStorage.removeItem("organization");
        }
        setOrganization(org);
    }, [setOrganization]);

    useEffect(() => {
        const organizationFromStorage = localStorage.getItem("organization");
        const organization = (organizationFromStorage ? JSON.parse(organizationFromStorage) : null) as Organization | null;
        setOrganization(organization);

        const service = new UserService();
        service.getOrganizations().then(orgs => {
            setOrganizations(orgs);
            if (organization !== null) {
                const newOrgData = orgs.find(o => o.name === organization.name);
                setOrganization(newOrgData ?? null);
                if (newOrgData) {
                    localStorage.setItem("organization", JSON.stringify(newOrgData));
                }
                else {
                    localStorage.removeItem("organization");
                }
            }
        }).catch((err) => {
            setOrganization(null);
        });

    }, [setOrganization, setOrganizations]);

    return (
        <organizationContext.Provider value={{ organization, organizations, setOrganization: changeOrg }}>{children}</organizationContext.Provider>
    );
};