'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Organization } from "@/db/schemas/organizations"
import { Subscription } from "@/db/schemas/subscriptions"
import { Button } from "../ui/button"
import { customerPortalAction } from "@/lib/stripe/server-actions"

interface OrganizationOverviewProps {
  organization: Organization & { subscriptions: Subscription[] }
}

export function OrganizationOverview({ organization }: OrganizationOverviewProps) {
  const latestSubscription = organization.subscriptions[0] 
  const subscriptionInfo = {
    planName: latestSubscription?.planName || '-',
    subscriptionStatus: latestSubscription?.subscriptionStatus || '-',
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Basic information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="mt-1">{organization.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">VAT Number</dt>
              <dd className="mt-1">{organization.vatnr}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Country</dt>
              <dd className="mt-1">{organization.country}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
              <dd className="mt-1">
                {organization.createdAt instanceof Date 
                  ? format(organization.createdAt, 'PPP') 
                  : format(new Date(organization.createdAt), 'PPP')}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Your current subscription plan and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-4 justify-between">
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Plan</dt>
                <dd className="mt-1 capitalize">{subscriptionInfo?.planName || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1 capitalize">{subscriptionInfo?.subscriptionStatus || '-'}</dd>
              </div>
            </dl>
            <form className="self-end" action={() => customerPortalAction(organization.id)}>
              <Button type="submit">Manage Subscription</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 