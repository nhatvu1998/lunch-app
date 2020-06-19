
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface DishInput {
    name: string;
    shopId: string;
}

export interface DishMenuInput {
    _id?: string;
    name: string;
    orderCount: number;
    count: number;
}

export interface FileInput {
    name?: string;
    count?: number;
}

export interface InputAddDish {
    menuId: string;
    dishes?: DishMenuInput[];
}

export interface InputChangePassword {
    password: string;
    newPassword: string;
}

export interface InputCreateMenu {
    name: string;
    siteId: string;
    shopId: string;
    dishes?: DishMenuInput[];
}

export interface InputCreateOrder {
    menuId: string;
    dishId: string;
}

export interface InputCreateOrderByAdmin {
    menuId: string;
    userId: string;
    dishId: string;
}

export interface InputCreateShop {
    name: string;
    siteId: string;
}

export interface InputCreateSite {
    name: string;
}

export interface InputLogin {
    username: string;
    password: string;
}

export interface InputRegister {
    username: string;
    password: string;
    passwordCheck: string;
}

export interface AccessTokenDto {
    token: string;
}

export interface Dish {
    _id?: string;
    name?: string;
    shopId?: string;
}

export interface DishInfo {
    _id?: string;
    name?: string;
    orderCount?: number;
    count?: number;
}

export interface Menu {
    _id?: string;
    name: string;
    isPublish: boolean;
    isLocked: boolean;
    siteId: string;
    shopId: string;
    dishes?: DishInfo[];
}

export interface IMutation {
    register(userData: InputRegister): UserEntity | Promise<UserEntity>;
    login(userData: InputLogin): AccessTokenDto | Promise<AccessTokenDto>;
    addDish(dish?: DishInput): Dish | Promise<Dish>;
    createMenu(data: InputCreateMenu): Menu | Promise<Menu>;
    addDishes(data?: InputAddDish): Menu | Promise<Menu>;
    importMenu(_id: string, shopId: string, fileInput: FileInput[]): Menu | Promise<Menu>;
    publishMenu(id: string): Menu | Promise<Menu>;
    lockMenu(siteId: string): Menu | Promise<Menu>;
    updateMenu(menuId?: string, dishes?: DishMenuInput[]): Menu | Promise<Menu>;
    createOrder(input: InputCreateOrder): Order | Promise<Order>;
    createOrderByAdmin(input: InputCreateOrderByAdmin): Order | Promise<Order>;
    deleteOrder(dishId: string): boolean | Promise<boolean>;
    deleteOrderByAdmin(dishId: string, userId: string): boolean | Promise<boolean>;
    addNote(input: string): Order | Promise<Order>;
    confirmEat(): Order | Promise<Order>;
    createShop(data: InputCreateShop): Shop | Promise<Shop>;
    deleteShop(id: string): Shop | Promise<Shop>;
    editShop(id: string, newName: string): Shop | Promise<Shop>;
    createSite(data: InputCreateSite): Site | Promise<Site>;
    deleteSite(id: string): Site | Promise<Site>;
    changePassword(userData?: InputChangePassword): UserEntity | Promise<UserEntity>;
}

export interface Order {
    _id?: string;
    user?: UserEntity;
    menu?: Menu;
    dishId?: string;
    count?: number;
    isConfirmed?: boolean;
    note?: string;
}

export interface IQuery {
    dishes(): Dish[] | Promise<Dish[]>;
    menu(): Menu[] | Promise<Menu[]>;
    findById(id: string): Menu | Promise<Menu>;
    findMenuBySiteId(siteId: string): Menu[] | Promise<Menu[]>;
    findPublishMenu(siteId: string): Menu[] | Promise<Menu[]>;
    orders(): Order[] | Promise<Order[]>;
    orderByUser(menuId: string): Order | Promise<Order>;
    findOrderByUserId(): Order | Promise<Order>;
    findOrderByMenuId(menuId: string): Order[] | Promise<Order[]>;
    shops(): Shop[] | Promise<Shop[]>;
    shop(id: string): Shop | Promise<Shop>;
    findShopBySiteId(id: string): Shop[] | Promise<Shop[]>;
    sites(): Site[] | Promise<Site[]>;
    site(id: string): Site | Promise<Site>;
    getAllUsers(): UserEntity[] | Promise<UserEntity[]>;
}

export interface Shop {
    _id?: string;
    name: string;
    siteId: string;
    dishes: Dish[];
}

export interface Site {
    _id?: string;
    name?: string;
    shops: Shop[];
}

export interface ISubscription {
    menuUpdate(): Menu | Promise<Menu>;
    orderUpdate(): Order | Promise<Order>;
}

export interface UserEntity {
    _id?: string;
    username?: string;
    password?: string;
    role?: string;
}
