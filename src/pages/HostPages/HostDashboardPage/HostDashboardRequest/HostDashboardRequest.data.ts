import { IHostDashboardRequestCard, RequestNotification } from './HostDashboardRequestCard/types';

export const DashboardRequestData: IHostDashboardRequestCard[] = [
  {
    user: {
      name: 'Антон Павлович',
      location: 'Казань, Россия',
    },
    notification: RequestNotification.NEW,
    article: 'Опушкинская археологическая экспедиция в Крыму: сезон-2020',
  },
  {
    user: {
      name: 'Серегей Шульга',
      location: 'Москва, Россия',
    },
    notification: RequestNotification.COMPLETED,
    article: 'Студенческий Экологический Отряд «Новая Земля»',
  },
  {
    user: {
      name: 'Федор Игнатьев',
      location: 'Набережные Челны, Россия',
    },
    notification: RequestNotification.REJECTED,
    article: 'Глэмпинг GlampStory Камчатка на Халактырском пляже!',
  },
];
