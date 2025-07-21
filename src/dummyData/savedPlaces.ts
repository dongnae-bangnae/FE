import ArtsIcon from "../assets/place/place-arts.svg";
import BarIcon from "../assets/place/place-bar.svg";
import BooksIcon from "../assets/place/place-books.svg";
import CafeIcon from "../assets/place/place-cafe.svg";
import FoodIcon from "../assets/place/place-food.svg";
import OthersIcon from "../assets/place/place-others.svg";
import SportsIcon from "../assets/place/place-sports.svg";
import WalkIcon from "../assets/place/place-walk.svg";

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
