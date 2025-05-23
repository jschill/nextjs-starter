"use server"
import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/services/server/auth'

export async function GET(request: NextRequest) {
  try {
    await signOut()
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}
