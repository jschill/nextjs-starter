"use server"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { getOrganizationWithMembers, getOrganizationInvitations } from "@/services/server/organization"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationOverview } from "@/components/organizations/organization-overview"
import { MembersList } from "@/components/organizations/members-list"
import { InviteForm } from "@/components/organizations/invite-form"
import { InvitationsList } from "@/components/organizations/invitations-list"

export default async function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  
  if (!user) {
    return notFound()
  }
  const { id: organizationId } = await params
  const [organizationData, invitationsData] = await Promise.all([
    getOrganizationWithMembers(organizationId),
    getOrganizationInvitations(organizationId)
  ])
  
  if (!organizationData) {
    return notFound()
  }
  // Check if user has permission to view this organization
  const userMembership = organizationData.organizationMembers.find(member => 
    member.userId === user.id
  )
  
  if (!userMembership) {
    return notFound()
  }
  
  const isAdmin = userMembership.role === 'admin' || userMembership.role === 'owner'
  
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{organizationData.name}</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OrganizationOverview organization={organizationData} />
        </TabsContent>
        
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Manage members of your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MembersList 
                members={organizationData.organizationMembers} 
                isAdmin={isAdmin}
                currentUserId={user.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>
                Invite new members to your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAdmin && (
                <InviteForm organizationId={organizationId} />
              )}
              
              <InvitationsList 
                invitations={invitationsData} 
                isAdmin={isAdmin} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}