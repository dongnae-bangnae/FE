import ArtsIcon from "../assets/place/place-arts.png";
import BarIcon from "../assets/place/place-bar.png";
import BooksIcon from "../assets/place/place-books.png";
import CafeIcon from "../assets/place/place-cafe.png";
import FoodIcon from "../assets/place/place-food.png";
import OthersIcon from "../assets/place/place-others.png";
import SportsIcon from "../assets/place/place-sports.png";
import WalkIcon from "../assets/place/place-walk.png";

export const savedPlaces: {
  [areaName: string]: {
    id: string;
    name: string;
    category: string;
    icon: string;
    lat: number;
    lng: number;
  }[];
} = {
  연남동: [
    {
      id: "1",
      name: "해옫 연남",
      category: "맛집",
      icon: FoodIcon,
      lat: 37.558514,
      lng: 126.925911
    },
    {
      id: "2",
      name: "산책로",
      category: "산책",
      icon: WalkIcon,
      lat: 37.559978,
      lng: 126.926245
    }
  ],
  종로3가: [
    {
      id: "3",
      name: "우정식당",
      category: "맛집",
      icon: FoodIcon,
      lat: 37.5703,
      lng: 126.992
    }
  ]
};
