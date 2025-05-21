import { createClient } from "@/utils/supabase/server"
import { getUserOrganizations } from "@/services/server/organization"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"

export default async function OrganizationsPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Get all organizations for the current user
  const userOrgs = await getUserOrganizations(user?.id || '')
  
  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/create-organization">
            <PlusCircle className="h-4 w-4" />
            <span>New Organization</span>
          </Link>
        </Button>
      </div>
      
      {userOrgs.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
          <p className="text-muted-foreground mb-4">
            You don&apos;t have any organizations yet. Create your first organization to get started.
          </p>
          <Button asChild>
            <Link href="/create-organization">Create Organization</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userOrgs.map((membership) => {
            console.log('membership', membership)
            const latestSubscription = membership.organization.subscriptions[0]
            return (
              <Card key={membership.organizationId} className="overflow-hidden">
                <CardHeader className="relative pb-8">
                  <CardTitle className="line-clamp-1">{membership.organization.name}</CardTitle>
                  <CardDescription>
                    {membership.role.charAt(0).toUpperCase() + membership.role.slice(1)}
                  </CardDescription>
                  
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link href={`/organizations/${membership.organizationId}`}>
                        <span className="sr-only">View</span>
                        <span>→</span>
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-1 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Country</dt>
                      <dd>{membership.organization.country}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="capitalize">{latestSubscription?.planName || '-'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
