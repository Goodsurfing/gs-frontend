export interface IParticipationDatesForm {
    startDates: Array<Date>;
    endDates: Array<Date>;
    allYearAround: boolean;
    lastMomentAccept: boolean;
    participationPeriod: Array<[Date, Date]>;
    deadlineDate: Date;
}
