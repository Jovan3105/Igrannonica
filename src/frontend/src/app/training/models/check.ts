export class Check {
  id: number;
  visible: boolean;

  constructor(id: number, visible: boolean) {
    this.id = id;
    this.visible = visible;
  }
}

export class HeaderDict {
  key: number;
  name: string;
  type:string;
  checked?:boolean;

  constructor(key:number,name:string,type:string = "")
  {
    this.key = key;
    this.name = name;
    this.type = type;
  }

}
