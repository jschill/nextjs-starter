import { checkUserHasOrganization } from '@/utils/organizations/check-user-org'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This runs server-side and checks if the user has an organization
  await checkUserHasOrganization()
  
  return <>{children}</>
} 