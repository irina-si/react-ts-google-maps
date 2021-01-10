class Stop {
    ID: string; 
    City: string; 
    Area: string;
    Street: string;
    Name: string;
    Info: string;
    Lng: number;
    Lat: number;
    Stops: string;
    StopNum: string;

    constructor(ID: string, City: string, Area: string, Street: string, Name: string, Info: string,
                Lng: number, Lat: number, Stops: string, StopNum: string) {
        this.ID = ID
        this.City = City
        this.Area = Area
        this.Street = Street
        this.Name = Name
        this.Info = Info
        this.Lng = Lng
        this.Lat = Lat
        this.Stops = Stops
        this.StopNum = StopNum
    }
}

function createArrOfStops(arr: string[]) {
    return arr.map(string => {
        let stopInfoArr = string.split(";");
        //@ts-ignore: An argument for 'ID' was not provided.
        return new Stop(...stopInfoArr);
    });
}

export default function parceResponse(response: string) {
    let array = response.split(/(?<=[0-9])\s(?=[0-9])/g);
    return createArrOfStops(array);
}
