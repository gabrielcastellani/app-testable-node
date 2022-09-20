import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { getFuruteDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe('Create Appointment', () => {
    it('should be able to create an appointment', () => {
        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(appointmentsRepository);
        const startsAt = getFuruteDate('2022-08-10');
        const endsAt = getFuruteDate('2022-08-11');

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt,
            endsAt,
        })).resolves.toBeInstanceOf(Appointment);
    });

    it('should not be able to create an appointment with overlapping dates', async () => {
        const startsAt = getFuruteDate('2022-08-10');
        const endsAt = getFuruteDate('2022-08-15');

        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(appointmentsRepository);

        await createAppointment.execute({
            customer: "John Doe",
            startsAt,
            endsAt,
        });

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFuruteDate('2022-08-14'),
            endsAt: getFuruteDate('2022-08-18'),
        })).rejects.toThrow();

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFuruteDate('2022-08-08'),
            endsAt: getFuruteDate('2022-08-12'),
        })).rejects.toThrow();

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFuruteDate('2022-08-08'),
            endsAt: getFuruteDate('2022-08-17'),
        })).rejects.toThrow();

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFuruteDate('2022-08-11'),
            endsAt: getFuruteDate('2022-08-12'),
        })).rejects.toThrow();
    });
});