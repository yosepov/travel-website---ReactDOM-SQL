export class Vacation {
    public constructor(
        public vacationID: number = 0,
        public description: string = "desciption",
        public location: string = "location",
        public image: string = "image",
        public startDate: string = "01-01-01",
        public endDate: string = "01-01-01",
        public price: number = 1,
    ) {
    }
}