import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

interface Photo {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  comment_count: number;
}

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-2">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/instagram/analyze/${photo.id}`}>
          <div className="aspect-square relative overflow-hidden group rounded-2xl">
            <Image
              src={photo.thumbnail_url || photo.media_url}
              alt="User post"
              fill
              className="object-cover transition-opacity group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1">
                <MessageCircle className="w-4 h-4 text-white mr-1" />
                <span className="text-white text-sm">
                  {photo.comment_count}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
