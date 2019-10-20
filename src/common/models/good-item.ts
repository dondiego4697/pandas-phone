import {observable} from 'mobx';

export interface IGoodItemDbModel {
    id?: string;
    type: string;
    model: string | null;
    brand: string | null;
    color: string | null;
    memory_capacity: number | null;
    original: boolean;
    search_tags: string[];
    price: number;
    discount: number;
    public: boolean;
    updated: string;
}

export interface IGoodItemModel {
    id?: string;
    type: string;
    brand: string | null;
    color: string | null;
    model: string | null;
    memoryCapacity: number | null;
    original: boolean;
    searchTags: string[];
    price: number;
    discount: number;
    public: boolean;
    updated: string;
}

export class GoodItemModel implements IGoodItemModel {
    @observable id?: string;
    @observable type: string;
    @observable brand: string | null;
    @observable color: string | null;
    @observable model: string | null;
    @observable memoryCapacity: number | null;
    @observable searchTags: string[];
    @observable original: boolean;
    @observable price: number;
    @observable discount: number;
    @observable public: boolean;
    @observable updated: string;

    constructor(data: IGoodItemDbModel) {
        this.id = data.id;
        this.type = data.type;
        this.brand = data.brand;
        this.color = data.color;
        this.model = data.model;
        this.memoryCapacity = data.memory_capacity;
        this.searchTags = data.search_tags;
        this.original = data.original;
        this.price = data.price;
        this.discount = data.discount;
        this.public = data.public;
        this.updated = data.updated;
    }

    getDbData(): IGoodItemDbModel {
        return {
            id: this.id,
            public: this.public,
            updated: this.updated,
            type: this.type,
            brand: this.brand,
            color: this.color,
            model: this.model,
            memory_capacity: this.memoryCapacity,
            search_tags: this.searchTags,
            original: this.original,
            price: this.price,
            discount: this.discount
        };
    }
}
