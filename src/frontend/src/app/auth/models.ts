export class Register
{
    
}

export class User{
    id:number;
    username:string;
    email:string;
    image:string;
    role:string;

    constructor(id:number,username:string,email:string,image:string,role:string)
    {
        this.id = id;
        this.username = username;
        this.email = email;
        this.image = image;
        this.role = role;
    }
}

//{username:f.value.username,
//email:f.value.email,
//passwordHashed:f.value.password}

/*
{
  "id": 1,
  "username": "string",
  "email": "79-2019@pmf.kg.ac.rs",
  "image": "assets\\resources\\string.png"
}
*/