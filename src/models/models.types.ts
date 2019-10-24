export interface TourDoc extends Document {
  slug: string;
  name: string;
  price: number;
  duration: number;
  start: number;
}
