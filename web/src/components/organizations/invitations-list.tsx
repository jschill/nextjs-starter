'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"

interface Invitation {
  id: string | number
  email: string
  role: string
  status: string
  invitedAt: string | Date
  // expiresAt?: string | Date | null
}

interface InvitationsListProps {
  invitations: Invitation[]
  isAdmin: boolean
}

export function InvitationsList({ invitations, isAdmin }: InvitationsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  
  const handleCancelInvitation = async (invitationId: string | number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to cancel this invitation?")) return
    
    setLoadingId(String(invitationId))
    
    try {
      const response = await fetch(`/api/organizations/invitations/${invitationId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel invitation')
      }
      
      toast.success('Invitation cancelled successfully')
      router.refresh()
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      toast.error('Failed to cancel invitation')
    } finally {
      setLoadingId(null)
    }
  }

  const handleResendInvitation = async (invitationId: string | number) => {
    if (!isAdmin) return
    
    setLoadingId(String(invitationId))
    
    try {
      const response = await fetch(`/api/organizations/invitations/${invitationId}/resend`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to resend invitation')
      }
      
      toast.success('Invitation resent successfully')
      router.refresh()
    } catch (error) {
      console.error('Error resending invitation:', error)
      toast.error('Failed to resend invitation')
    } finally {
      setLoadingId(null)
    }
  }
  
  if (invitations.length === 0) {
    return <p className="text-muted-foreground">No pending invitations.</p>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent</TableHead>
            {isAdmin && <TableHead className="w-[180px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const isPending = invitation.status === 'pending'
            
            return (
              <TableRow key={invitation.id}>
                <TableCell>{invitation.email}</TableCell>
                <TableCell className="capitalize">{invitation.role}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(invitation.status)}>
                    {invitation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(invitation.invitedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {/* {invitation.expiresAt 
                    ? format(new Date(invitation.expiresAt), 'MMM d, yyyy')
                    : '-'} */}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id)}
                            disabled={loadingId === String(invitation.id)}
                          >
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            disabled={loadingId === String(invitation.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {!isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          disabled={loadingId === String(invitation.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'expired':
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
} 