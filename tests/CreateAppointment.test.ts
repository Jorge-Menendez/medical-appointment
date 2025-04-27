import { CreateAppointment } from '../src/application/usecases/CreateAppointment';
import { Appointment } from '../src/domain/entities/Appointment';
import {CreateAppointmentCommand} from "../src/interfaces/CreateAppointmentCommand";

const mockRepository = {
    savePending: jest.fn(),
    updateStatusToCompleted: jest.fn(),
    findByInsuredId: jest.fn()
};

const mockPublisher = {
    publish: jest.fn(),
};

describe('CreateAppointment Use Case', () => {
    it('debe crear y guardar un appointment válido', async () => {
        const useCase = new CreateAppointment(mockRepository, mockPublisher);

        await useCase.execute({
            insuredId: '01234',
            scheduleId: 123,
            countryISO: 'PE'
        });

        expect(mockRepository.savePending).toHaveBeenCalled();
        expect(mockPublisher.publish).toHaveBeenCalled();
    });

    it('debe fallar si insuredId no tiene 5 dígitos', async () => {
        const useCase = new CreateAppointment(mockRepository, mockPublisher);

        await expect(() =>
            useCase.execute({
                insuredId: '123',
                scheduleId: 123,
                countryISO: 'PE'
            })
        ).rejects.toThrow('insuredId debe tener 5 dígitos');
    });

    it('debe fallar si countryISO no es PE o CL', async () => {
        const useCase = new CreateAppointment(mockRepository, mockPublisher);

        const invalidCommand = {
            insuredId: '01234',
            scheduleId: 123,
            countryISO: 'AR' // Valor inválido
        } as unknown as CreateAppointmentCommand;

        await expect(() =>
            useCase.execute(invalidCommand)
        ).rejects.toThrow('countryISO debe ser PE o CL');
    });

});
