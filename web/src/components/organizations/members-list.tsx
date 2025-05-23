'use client'

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Member {
  id: string | number
  userId: string
  organizationId: string
  role: string
  joinedAt: string | Date
  user?: {
    email?: string
  }
  email?: string
}

interface MembersListProps {
  members: Member[]
  isAdmin: boolean
  currentUserId: string
}

export function MembersList({ members, isAdmin, currentUserId }: MembersListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  
  const handleRemoveMember = async (memberId: string | number) => {
    if (!isAdmin) return
    if (!confirm('Are you sure you want to remove this member?')) return
    
    setIsLoading(String(memberId))
    
    try {
      const response = await fetch(`/api/organizations/members/${memberId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove member')
      }
      
      router.refresh()
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove member')
    } finally {
      setIsLoading(null)
    }
  }
  
  const handleChangeRole = async (memberId: string | number, role: string) => {
    if (!isAdmin) return
    
    setIsLoading(String(memberId))
    
    try {
      const response = await fetch(`/api/organizations/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update role')
      }
      
      router.refresh()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role')
    } finally {
      setIsLoading(null)
    }
  }
  
  if (members.length === 0) {
    return <p className="text-muted-foreground">No members found.</p>
  }
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isCurrentUser = member.userId === currentUserId
            const memberEmail = member.user?.email || member.email || 'Unknown'
            const formattedJoinDate = new Date(member.joinedAt).toLocaleDateString()
            
            return (
              <TableRow key={member.id}>
                <TableCell>{memberEmail}</TableCell>
                <TableCell className="capitalize">{member.role}</TableCell>
                <TableCell>{formattedJoinDate}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isLoading === String(member.id)}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!isCurrentUser && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(member.id, 'admin')}
                              disabled={member.role === 'admin' || member.role === 'owner'}
                            >
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(member.id, 'member')}
                              disabled={member.role === 'member' || member.role === 'owner'}
                            >
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={member.role === 'owner'}
                              className="text-destructive focus:text-destructive"
                            >
                              Remove
                            </DropdownMenuItem>
                          </>
                        )}
                        {isCurrentUser && (
                          <DropdownMenuItem disabled>
                            {member.role === 'owner' ? 'Owner' : 'This is you'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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