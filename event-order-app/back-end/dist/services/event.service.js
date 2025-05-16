"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventService = CreateEventService;
exports.GetEventService = GetEventService;
exports.GetAllEventService = GetAllEventService;
exports.UpdateEventService = UpdateEventService;
exports.DeleteEventService = DeleteEventService;
exports.SearchEventService = SearchEventService;
exports.GetEventsByOrganizerService = GetEventsByOrganizerService;
exports.getEventWithAttendees = getEventWithAttendees;
const prisma_1 = __importDefault(require("../lib/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
function CreateEventService(param, file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (file) {
                const uploadResult = yield (0, cloudinary_1.uploadImageToCloudinary)(file);
                param.banner_url = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
            }
            const result = yield prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                // Pastikan tickets berupa array setelah parsing
                let parsedTickets = [];
                if (typeof param.tickets === "string") {
                    parsedTickets = JSON.parse(param.tickets).map((t) => ({
                        name: t.name,
                        type: t.type,
                        description: t.description,
                        sales_start: t.sales_start,
                        sales_end: t.sales_end,
                        created_at: t.created_at,
                        updated_at: t.updated_at,
                        quota: Number(t.quota),
                        remaining: Number(t.remaining),
                        price: Number(t.price),
                        created_by_id: Number(t.created_by_id),
                    })); // Mengubah string JSON menjadi array objek
                }
                let parsedVouchers = [];
                if (typeof param.vouchers === "string") {
                    parsedVouchers = JSON.parse(param.vouchers).map((t) => ({
                        code: t.code,
                        description: t.description,
                        discount_amount: Number(t.discount_amount),
                        sales_start: t.sales_start,
                        sales_end: t.sales_end,
                        created_at: t.created_at,
                        updated_at: t.updated_at,
                        created_by_id: t.created_by_id,
                    })); // Mengubah string JSON menjadi array objek
                }
                const event = yield prisma.event.create({
                    data: {
                        name: param.name,
                        description: JSON.parse(param.description),
                        category_id: Number(param.category_id),
                        location: param.location,
                        start_date: param.start_date,
                        end_date: param.end_date,
                        available_seats: Number(param.available_seats),
                        banner_url: param.banner_url,
                        status: param.status,
                        created_at: new Date(),
                        updated_at: new Date(),
                        organizer_id: Number(param.organizer_id),
                        tickets: {
                            create: parsedTickets,
                        },
                        vouchers: {
                            create: parsedVouchers,
                        },
                    },
                });
                return event;
            }));
            return result;
        }
        catch (err) {
            throw err;
        }
    });
}
function GetAllEventService() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield prisma_1.default.event.findMany({
                where: {
                    start_date: {
                        gt: new Date(),
                    },
                    status: "Publish",
                },
                include: {
                    category: true,
                    tickets: true,
                },
            });
            return event;
        }
        catch (err) {
            throw err;
        }
    });
}
function GetEventService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield prisma_1.default.event.findUnique({
                where: { id },
                include: {
                    tickets: true,
                    category: true,
                    organizer: true,
                },
            });
            return event;
        }
        catch (err) {
            throw err;
        }
    });
}
function UpdateEventService(id, param) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const event = yield prisma.event.update({
                    where: { id },
                    data: {
                        name: param.name,
                        description: param.description,
                        category_id: param.category_id,
                        location: param.location,
                        start_date: param.start_date,
                        end_date: param.end_date,
                        available_seats: param.available_seats,
                        banner_url: param.banner_url,
                        status: param.status,
                        updated_at: new Date(),
                    },
                });
                return event;
            }));
            return result;
        }
        catch (err) {
            throw err;
        }
    });
}
function DeleteEventService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const user = yield prisma.event.delete({
                    where: { id },
                });
                return user;
            }));
            return result;
        }
        catch (err) {
            throw err;
        }
    });
}
function SearchEventService(eventName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield prisma_1.default.event.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: eventName,
                                mode: "insensitive",
                            },
                        },
                        {
                            location: {
                                contains: eventName,
                                mode: "insensitive",
                            },
                        },
                        {
                            category: {
                                name: {
                                    contains: eventName,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                },
                include: {
                    category: true,
                    tickets: true,
                },
            });
            return event;
        }
        catch (err) {
            throw err;
        }
    });
}
function GetEventsByOrganizerService(organizerId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = yield prisma_1.default.event.findMany({
                where: {
                    organizer_id: organizerId,
                },
                include: {
                    organizer: true, // Menyertakan data organizer
                    category: true, // Menyertakan data kategori
                    tickets: true, // Menyertakan data tiket
                    vouchers: true,
                },
                orderBy: {
                    created_at: "desc",
                },
            });
            return events;
        }
        catch (err) {
            throw err;
        }
    });
}
function getEventWithAttendees(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Jangan disconnect prisma di finally jika menggunakan connection pooling!
        // Biarkan prisma manage koneksinya sendiri
        const event = yield prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: {
                transactions: {
                    where: { status: "approve" }, // Filter hanya yang approved (optional)
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!event) {
            throw new Error();
        }
        const attendees = event.transactions
            .filter((trx) => {
            if (!trx.user) {
                console.warn(`Transaction ${trx.id} has no user associated`);
                return false;
            }
            return true;
        })
            .map((trx) => ({
            id: trx.user.id,
            first_name: trx.user.first_name,
            last_name: trx.user.last_name,
            email: trx.user.email,
            status: trx.status,
        }));
        return {
            id: event.id,
            name: event.name,
            attendees,
            total_attendees: attendees.length,
            // Tambahan:
            event_date: event.start_date,
            location: event.location,
        };
    });
}
