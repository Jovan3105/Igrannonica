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
  type?: string;

  constructor(key: number, name: string, type: string = "") {
    this.key = key;
    this.name = name;
    this.type = type;
  }

}

export class EditedCell {

  row: number;
  col: number;
  value: string;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
}
export class ModifiedData {
  id: number;
  edited: EditedCell[];
  deleted: number[];

  constructor(id: number, edited: EditedCell[], deleted: number[]) {
    this.id = id;
    this.edited = edited;
    this.deleted = deleted;
  }
}