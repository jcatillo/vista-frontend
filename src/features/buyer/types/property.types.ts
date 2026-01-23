export interface Property {
  id: string;
  title: string;
  location: string;
  distance?: string;
  availability?: string;
  pricePerNight: number;
  rating: number;
  imageUrls: string[];
  isGuestFavorite: boolean;
  category: "Room" | "Condo" | "Entire Home";
}
