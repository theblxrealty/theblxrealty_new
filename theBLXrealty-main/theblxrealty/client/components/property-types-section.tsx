import PropertyTypeCard from "./property-type-card"

const propertyTypes = [
  {
    title: "Villas",
    imageSrc: "/property_type/villa.webp",
    href: "/properties?type=luxury villas",
    alt: "Luxury Villas"
  },
  {
    title: "Flats",
    imageSrc: "/property_type/flats.webp",
    href: "/properties?type=flats",
    alt: "Flats"
  },
  // {
  //   title: "New Building",
  //   imageSrc: "/property_type/house.webp",
  //   href: "/properties?type=new buildings",
  //   alt: "New Building"
  // },
  // {
  //   title: "Farm House",
  //   imageSrc: "/property_type/farmhouse.webp",
  //   href: "/properties?type=farm house",
  //   alt: "Farm House"
  // },
  {
    title: "Sites",
    imageSrc: "/property_type/sites.webp",
    href: "/properties?type=sites",
    alt: "Sites"
  },
  {
    title: "Commercial",
    imageSrc: "/property_type/commercial.webp",
    href: "/properties?type=commercial",
    alt: "Commercial Properties"
  },
  // {
  //   title: "Investment",
  //   imageSrc: "/property_type/img2.webp",
  //   href: "/properties?type=investment",
  //   alt: "Investment Properties"
  // }
]

export default function PropertyTypesSection() {
  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8 pt-4 pb-4">
          {propertyTypes.map((propertyType, index) => (
            <PropertyTypeCard
              key={index}
              title={propertyType.title}
              imageSrc={propertyType.imageSrc}
              href={propertyType.href}
              alt={propertyType.alt}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 