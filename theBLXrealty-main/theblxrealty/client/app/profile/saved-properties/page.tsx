import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SavedPropertiesClient from './saved-properties-client'

export default async function SavedPropertiesPage() {
  const session = await getServerSession() as any
  
  if (!session?.user?.id) {
    redirect('/')
  }

  try {
    const savedProperties = await prisma.savedProperty.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            location: true,
            propertyType: true,
            propertyCategory: true,
            bedrooms: true,
            bathrooms: true,
            area: true,
            propertyBanner1: true,
            propertyBanner2: true,
            additionalImages: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return <SavedPropertiesClient savedProperties={savedProperties} />
  } catch (error) {
    console.warn('Error fetching saved properties:', error)
    redirect('/')
  }
}

