import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    // Test the database connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Check properties count
    const propertiesCount = await prisma.property.count()
    console.log(`📊 Total properties in database: ${propertiesCount}`)
    
    if (propertiesCount > 0) {
      // Get sample properties to see their types
      const sampleProperties = await prisma.property.findMany({
        take: 8,
        select: {
          id: true,
          title: true,
          propertyType: true,
          location: true,
          bedrooms: true,
          bathrooms: true,
          area: true
        }
      })
      
      console.log('🏠 Sample properties:')
      sampleProperties.forEach((prop, index) => {
        const bedsInfo = prop.bedrooms ? `${prop.bedrooms} beds` : 'No beds'
        const bathsInfo = prop.bathrooms ? `${prop.bathrooms} baths` : 'No baths'
        console.log(`  ${index + 1}. ${prop.title} (${prop.propertyType}) - ${prop.location}`)
        console.log(`      Area: ${prop.area} sq ft | ${bedsInfo} | ${bathsInfo}`)
      })
      
      // Get property type distribution
      const propertyTypes = await prisma.property.groupBy({
        by: ['propertyType'],
        _count: {
          propertyType: true
        }
      })
      
      console.log('🏗️ Property type distribution:')
      propertyTypes.forEach(type => {
        console.log(`  ${type.propertyType || 'NULL'}: ${type._count.propertyType}`)
      })
      
      // Check for properties without propertyType
      const nullPropertyTypes = await prisma.property.count({
        where: {
          propertyType: null
        }
      })
      
      if (nullPropertyTypes > 0) {
        console.log(`⚠️ Properties without propertyType: ${nullPropertyTypes}`)
      }
    } else {
      console.log('⚠️ No properties found in database. You may need to run the seed script.')
    }
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Run this function to test the connection
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('Test failed:', error)
      process.exit(1)
    })
} 