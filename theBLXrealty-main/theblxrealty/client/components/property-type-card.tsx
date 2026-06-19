import Link from "next/link"
import Image from "next/image"

interface PropertyTypeCardProps {
  title: string
  imageSrc: string
  href: string
  alt: string
}

export default function PropertyTypeCard({ title, imageSrc, href, alt }: PropertyTypeCardProps) {
  return (
    <Link href={href} className="group block w-full">
      <div className="w-full bg-white transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-bold text-[#011337]" style={{fontFamily: 'Suisse Intl, sans-serif', fontWeight: '500', lineHeight: '1.16', fontSize: '1.2rem'}}>{title}</h3>
        </div>
      </div>
    </Link>
  )
} 