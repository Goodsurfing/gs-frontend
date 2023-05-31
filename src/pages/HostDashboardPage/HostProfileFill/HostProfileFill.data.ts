import { IChartDoughnut } from "shared/lib/chartJS";

export interface IProfileFillItem extends IChartDoughnut {}

export const ProfileFillItems: IProfileFillItem[] = [
  {
    text: "Описание",
    completed: true,
  },
  {
    text: "Фотографии",
    completed: true,
  },
  {
    text: "Видео",
    completed: true,
  },
  {
    text: "Предложения",
    completed: true,
  },
  {
    text: "Отзывы",
    completed: false,
  },
];
