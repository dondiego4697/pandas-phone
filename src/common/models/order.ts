import {observable} from 'mobx';

export interface IOrderDbModel {
    id?: string;
    customer_name: string;
    customer_phone: string;
    called: boolean;
    order_date: string;
}

export interface IOrderModel {
    id?: string;
    customerName: string;
    customerPhone: string;
    called: boolean;
    orderDate: string;
}

export class OrderModel implements IOrderModel {
    @observable id?: string;
    @observable customerName: string;
    @observable customerPhone: string;
    @observable called: boolean;
    @observable orderDate: string;

    constructor(data: IOrderDbModel) {
        this.id = data.id;
        this.customerName = data.customer_name;
        this.customerPhone = data.customer_phone;
        this.called = data.called;
        this.orderDate = data.order_date;
    }

    getDbData(): IOrderDbModel {
        return {
            id: this.id,
            called: this.called,
            customer_name: this.customerName,
            customer_phone: this.customerPhone,
            order_date: this.orderDate
        };
    }
}
