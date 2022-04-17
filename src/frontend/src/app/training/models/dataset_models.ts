export class Dataset
{
    public:boolean;
    userID:number;
    description:string;
    name:string;
    datasetSource:string;
 
    constructor(is_public:boolean, userID:number, description:string,name:string,datasetSource:string = "")
    {
        this.public = is_public;
        this.userID = userID;
        this.description = description;
        this.name = name;
        this.datasetSource = datasetSource;
    }
}